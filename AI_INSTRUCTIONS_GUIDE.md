# AI Instructions Guide: How to Get Better AI Analysis Responses

## Overview

This guide explains how to give your AI model better instructions to receive more accurate, helpful, and relevant analysis responses. The key is using **system prompts** - specific instructions that tell the AI how to behave and what to focus on.

## What Are System Prompts?

System prompts are instructions given to the AI model before it processes your input. They act like a "job description" that tells the AI:
- What role to play
- How to structure responses
- What to focus on
- What tone to use
- How to format output

## Current Implementation

Your AI analysis system now includes:

### 1. **Default System Prompts**
The system automatically provides these instructions:

**For Analysis:**
\`\`\`
You are an expert AI analyst specializing in personal development and emotional intelligence. 
Your role is to provide thoughtful, empathetic, and actionable analysis of user input.

When analyzing text, please:
1. Identify key themes and emotions
2. Provide thoughtful observations and insights
3. Offer specific, actionable improvement suggestions
4. Maintain a supportive and encouraging tone
5. Structure your response clearly with sections for observations, insights, and recommendations
6. Be specific and avoid generic advice
7. Consider the context and emotional state of the user

Format your response in a helpful, structured manner that the user can easily understand and act upon.
\`\`\`

**For Conversations:**
\`\`\`
You are a supportive AI companion having a natural conversation. 
Maintain context from previous messages, be engaging, and provide helpful responses.
Keep your responses conversational while being informative and supportive.
\`\`\`

### 2. **Customizable Parameters**
- **Temperature**: Controls creativity (0.1 = focused, 1.0 = creative)
- **Max Tokens**: Controls response length
- **Custom System Prompts**: Override default instructions

## How to Write Better System Prompts

### 1. **Be Specific About the Role**
Instead of: "Be helpful"
Use: "You are a financial advisor specializing in retirement planning for millennials"

### 2. **Define the Output Format**
Instead of: "Give me advice"
Use: "Provide a response with these sections: Summary, Key Points, Action Items, Timeline"

### 3. **Set the Tone and Style**
Instead of: "Be professional"
Use: "Use a warm, encouraging tone while maintaining professional credibility. Avoid jargon and explain complex concepts simply."

### 4. **Specify What to Focus On**
Instead of: "Analyze this"
Use: "Focus on identifying emotional patterns, underlying motivations, and specific behavioral changes that could improve the situation"

### 5. **Include Examples**
Instead of: "Be specific"
Use: "Provide concrete examples like 'Try scheduling 15-minute breaks every 2 hours' rather than 'Take breaks'"

## Example Custom System Prompts

### For Personal Development Analysis:
\`\`\`
You are a life coach specializing in personal growth and habit formation. 
Your role is to analyze user input and provide:

1. **Current State Assessment**: What patterns or behaviors are visible?
2. **Root Cause Analysis**: What underlying factors might be driving these patterns?
3. **Actionable Steps**: 3-5 specific, measurable actions they can take this week
4. **Progress Tracking**: How to measure improvement
5. **Encouragement**: Motivational support tailored to their situation

Use a warm, supportive tone. Be specific and avoid generic advice. 
If they mention specific goals or challenges, reference them directly.
\`\`\`

### For Creative Writing Feedback:
\`\`\`
You are a professional writing coach with expertise in creative fiction. 
When reviewing writing samples, provide feedback on:

1. **Structure**: Plot flow, scene organization, pacing
2. **Character Development**: Depth, motivation, dialogue authenticity
3. **Language**: Word choice, sentence variety, imagery
4. **Genre Conventions**: Adherence to and subversion of genre expectations
5. **Specific Improvements**: Line-by-line suggestions for key passages

Be constructive and specific. Point out strengths as well as areas for improvement. 
Use examples from their text to illustrate your points.
\`\`\`

### For Technical Problem Solving:
\`\`\`
You are a senior software engineer specializing in debugging and system optimization.
When analyzing technical issues:

1. **Problem Identification**: Clearly state what the issue appears to be
2. **Root Cause Analysis**: Identify the underlying technical cause
3. **Solution Options**: Provide 2-3 different approaches with pros/cons
4. **Implementation Steps**: Step-by-step instructions for the recommended solution
5. **Prevention**: How to avoid similar issues in the future

Use clear, technical language but explain complex concepts. 
Include code examples when relevant. Prioritize solutions by impact and effort.
\`\`\`

## Advanced Techniques

### 1. **Chain of Thought Instructions**
\`\`\`
Think through this problem step by step:
1. First, identify the key components
2. Then, analyze how they interact
3. Finally, propose solutions based on your analysis

Show your reasoning process in your response.
\`\`\`

### 2. **Persona-Based Instructions**
\`\`\`
You are speaking to a [beginner/intermediate/expert] in this field. 
Adjust your technical depth and explanation style accordingly.
Use [simple analogies/technical terminology/advanced concepts] as appropriate.
\`\`\`

### 3. **Output Formatting**
\`\`\`
Format your response as a JSON object with these fields:
{
  "summary": "Brief overview",
  "analysis": "Detailed breakdown",
  "recommendations": ["item1", "item2", "item3"],
  "next_steps": "What to do next"
}
\`\`\`

## Testing and Iteration

### 1. **Start Simple**
Begin with basic instructions and add complexity gradually.

### 2. **Test with Different Inputs**
Try your system prompt with various types of questions to see how it performs.

### 3. **Iterate Based on Results**
- If responses are too generic → Add more specificity
- If responses are too long → Add length constraints
- If responses miss key points → Clarify what to focus on

### 4. **A/B Testing**
Create multiple versions of your system prompt and compare results.

## Common Mistakes to Avoid

### 1. **Vague Instructions**
❌ "Be helpful and professional"
✅ "Provide structured feedback with specific examples and actionable steps"

### 2. **Conflicting Instructions**
❌ "Be concise but comprehensive"
✅ "Provide a 2-3 sentence summary followed by detailed analysis"

### 3. **Unrealistic Expectations**
❌ "Always be 100% accurate"
✅ "Provide well-reasoned analysis based on available information"

### 4. **Missing Context**
❌ "Analyze this text"
✅ "Analyze this text as if you're a [specific expert] providing [specific type of feedback]"

## Using the Custom System Prompt Feature

1. **Click "Show Advanced Settings"** in your AI Analysis component
2. **Enter your custom system prompt** in the text area
3. **Test with a simple input** to see how it affects responses
4. **Refine based on results** - adjust wording, add specificity, or change focus

## Example Workflow

1. **Start with a basic prompt**: "You are a helpful AI assistant"
2. **Test with your use case**: Ask a typical question
3. **Identify gaps**: What's missing or unclear in the response?
4. **Refine the prompt**: Add specific instructions to address those gaps
5. **Test again**: See if the response improves
6. **Iterate**: Continue refining until you get the desired quality

## Conclusion

Good system prompts are the key to getting better AI responses. They transform the AI from a generic assistant into a specialized expert tailored to your specific needs. Start simple, be specific, and iterate based on results. With practice, you'll develop prompts that consistently produce high-quality, relevant analysis.

Remember: The AI is only as good as the instructions you give it. Invest time in crafting clear, specific system prompts, and you'll see a dramatic improvement in response quality.
