// src/services/ai.service.js
const { aiConfig, USE_MOCK_AI } = require("../config/ai");
const { GoogleGenAI } = require("@google/genai");

class AIService {
  constructor() {
    this.useMock = USE_MOCK_AI;

    if (!this.useMock) {
      this.ai = new GoogleGenAI({
        apiKey: aiConfig.apiKey,
      });
    }
  }

  async getResponse(message, financialContext) {
    if (this.useMock) {
      return this.getMockResponse(message, financialContext);
    }

    try {
      const response = await this.ai.models.generateContent({
        model: aiConfig.model,
        contents: message,
        config: {
          systemInstruction: this.buildSystemPrompt(financialContext),
          maxOutputTokens: aiConfig.maxTokens,
          temperature: aiConfig.temperature,
        },
      });

      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);

      return "I'm having trouble connecting to my AI service. Here's some general financial advice: Focus on tracking your expenses, create a budget, and save regularly when possible.";
    }
  }

  async getInsight(financialContext) {
    if (this.useMock) {
      return this.getMockInsight(financialContext);
    }

    try {
      const response = await this.ai.models.generateContent({
        model: aiConfig.model,
        contents: `Based on this financial data, provide one key insight and recommendation: ${JSON.stringify(
          financialContext,
        )}`,
        config: {
          systemInstruction:
            "You are FinSage, a personal finance adviser. Provide a concise, actionable insight based on the user's financial data. Focus on one key observation and give a specific recommendation.",
          maxOutputTokens: 200,
          temperature: 0.7,
        },
      });

      const content = response.text;

      return {
        insight: content.split(".")[0] + ".",
        recommendation:
          content.split(".")[1] ||
          "Track your spending to identify areas for improvement.",
        type: "general",
      };
    } catch (error) {
      console.error("Gemini API Error:", error);

      return this.getMockInsight(financialContext);
    }
  }

  buildSystemPrompt(financialContext) {
    return `You are FinSage, a professional AI finance adviser. You have access to the user's financial data and should provide practical, data-backed advice.

Current financial context:
- Balance: $${financialContext.balance?.toFixed(2) || "0.00"}
- Total Income: $${financialContext.totalIncome?.toFixed(2) || "0.00"}
- Total Expenses: $${financialContext.totalExpenses?.toFixed(2) || "0.00"}
- Month: ${financialContext.month || "current"}

Recent transactions: ${JSON.stringify(
      financialContext.recentTransactions || [],
    )}

Category breakdown: ${JSON.stringify(financialContext.categoryBreakdown || [])}

Budgets: ${JSON.stringify(financialContext.budgets || [])}

Important guidelines:
1. Base your advice on the user's actual financial data
2. Be practical and specific
3. Keep responses concise and actionable
4. Include specific numbers when referencing the user's finances
5. Don't provide licensed financial advice for investments or major decisions
6. Include a disclaimer for any significant financial decisions

Format: Provide clear, structured responses with actionable insights.`;
  }

  getMockResponse(message, financialContext) {
    const lowerMessage = message.toLowerCase();
    const response = this.generateMockResponse(lowerMessage, financialContext);

    return response;
  }

  generateMockResponse(message, context) {
    const responses = {
      spend: `Based on your spending data, you've spent $${context.totalExpenses?.toFixed(
        2,
      )} this month. Your top spending categories include ${context.categoryBreakdown
        ?.slice(0, 3)
        .map((c) => `${c.category} ($${c.amount.toFixed(2)})`)
        .join(
          ", ",
        )}. Consider tracking these categories more closely to identify savings opportunities.`,

      budget: `Your budget status: ${
        context.budgets
          ?.map(
            (b) =>
              `${b.category}: $${b.spent.toFixed(
                2,
              )} of $${b.budgetAmount.toFixed(
                2,
              )} (${b.utilization.toFixed(0)}% used)`,
          )
          .join(" | ") ||
        "No budgets set up yet. Consider creating budgets for your main spending categories."
      }`,

      save: `Based on your income of $${context.totalIncome?.toFixed(
        2,
      )} and expenses of $${context.totalExpenses?.toFixed(
        2,
      )}, you could potentially save $${(
        context.totalIncome - context.totalExpenses
      )?.toFixed(
        2,
      )} this month. Try to reduce spending in your top categories to increase savings.`,

      category: `Your highest spending categories: ${
        context.categoryBreakdown
          ?.slice(0, 3)
          .map((c) => `${c.category} ($${c.amount.toFixed(2)})`)
          .join(", ") || "No categories with significant spending found."
      }`,
    };

    for (const [key, value] of Object.entries(responses)) {
      if (message.includes(key)) {
        return (
          value +
          "\n\n**Disclaimer:** This is general financial advice. For personalized financial planning, consider consulting a licensed financial professional."
        );
      }
    }

    return `Based on your financial data:
- Balance: $${context.balance?.toFixed(2)}
- Income: $${context.totalIncome?.toFixed(2)}
- Expenses: $${context.totalExpenses?.toFixed(2)}

I recommend focusing on tracking your expenses and setting clear budget goals. Your top categories for spending are ${context.categoryBreakdown
      ?.slice(0, 3)
      .map((c) => c.category)
      .join(
        ", ",
      )}. Consider reviewing these categories to identify potential savings.

**Disclaimer:** This is general financial advice. For personalized financial planning, consider consulting a licensed financial professional.`;
  }

  getMockInsight(context) {
    let insight = "";
    let recommendation = "";

    if (context.budgets && context.budgets.length > 0) {
      const overBudget = context.budgets.find((b) => b.utilization > 100);

      const nearBudget = context.budgets.find(
        (b) => b.utilization > 90 && b.utilization <= 100,
      );

      if (overBudget) {
        insight = `Your ${overBudget.category} spending ($${overBudget.spent.toFixed(
          2,
        )}) has exceeded your budget of $${overBudget.budgetAmount.toFixed(
          2,
        )}.`;

        recommendation = `Consider reducing ${overBudget.category} spending by setting a lower weekly limit or finding cheaper alternatives.`;

        return {
          insight,
          recommendation,
          type: "warning",
        };
      }

      if (nearBudget) {
        insight = `Your ${nearBudget.category} spending is at ${nearBudget.utilization.toFixed(
          0,
        )}% of your budget.`;

        recommendation = `Monitor your ${nearBudget.category} spending closely this month to stay within budget.`;

        return {
          insight,
          recommendation,
          type: "warning",
        };
      }
    }

    if (context.totalExpenses && context.totalIncome) {
      const savingsRate =
        ((context.totalIncome - context.totalExpenses) / context.totalIncome) *
        100;

      if (savingsRate < 10) {
        insight = `Your savings rate is ${savingsRate.toFixed(
          1,
        )}%, which is below the recommended 20%.`;

        recommendation =
          "Try to reduce discretionary spending or find ways to increase your income.";

        return {
          insight,
          recommendation,
          type: "action",
        };
      }
    }

    if (context.categoryBreakdown && context.categoryBreakdown.length > 0) {
      const topCategory = context.categoryBreakdown[0];

      if (topCategory && topCategory.amount > context.totalExpenses * 0.3) {
        insight = `${topCategory.category} accounts for ${(
          (topCategory.amount / context.totalExpenses) *
          100
        ).toFixed(0)}% of your spending.`;

        recommendation = `Review your ${topCategory.category} purchases to identify if this spending aligns with your financial goals.`;

        return {
          insight,
          recommendation,
          type: "info",
        };
      }
    }

    insight =
      "Your financial health looks stable with a balanced approach to spending.";

    recommendation =
      "Continue tracking your finances and consider setting specific savings goals.";

    return {
      insight,
      recommendation,
      type: "positive",
    };
  }
}

module.exports = new AIService();
