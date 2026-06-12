import os

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "your_key_here")


def analyze(resume_text: str, job_description: str) -> dict:
    # TODO: replace mock with real API call
    # import openai
    # client = openai.OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com")
    # response = client.chat.completions.create(
    #     model="deepseek-chat",
    #     messages=[
    #         {"role": "system", "content": "You are a resume/job-fit analyzer. Respond as JSON."},
    #         {"role": "user", "content": f"Resume:\n{resume_text}\n\nJob description:\n{job_description}"},
    #     ],
    # )
    return {
        "score": 82,
        "strengths": ["Python", "Data analysis"],
        "gaps": ["System design", "Leadership"],
        "suggestion": "Highlight your quant trading bot project",
    }
