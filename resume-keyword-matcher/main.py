import re
from collections import Counter
from datetime import datetime


# This function collects multiple lines of input until the user types END.
def get_multiline_input(prompt):
    print(prompt)
    print("Type END on a new line when finished.")

    lines = []
    while True:
        line = input()
        if line.strip() == "END":
            break
        lines.append(line)

    return "\n".join(lines)


# This function converts text to lowercase, removes punctuation, splits into words,
# and removes common stop words.
def clean_text(text):
    stop_words = {
        "the", "and", "for", "with", "to", "of", "in", "on",
        "a", "an", "is", "are", "be", "this", "that"
    }

    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    words = text.split()

    cleaned_words = [word for word in words if word not in stop_words]
    return cleaned_words


# This function counts word frequency and returns the top repeated useful words.
def extract_keywords(words, top_n=30):
    word_counts = Counter(words)
    most_common = word_counts.most_common(top_n)
    return [word for word, _ in most_common]


# This function compares job and resume keywords and calculates matching details.
def calculate_match(job_keywords, resume_keywords):
    job_set = set(job_keywords)
    resume_set = set(resume_keywords)

    matching_keywords = sorted(job_set.intersection(resume_set))
    missing_keywords = sorted(job_set.difference(resume_set))

    if len(job_set) == 0:
        match_percentage = 0.0
    else:
        match_percentage = (len(matching_keywords) / len(job_set)) * 100

    return matching_keywords, missing_keywords, match_percentage


# This function saves the comparison result into a report text file.
def save_report(file_name, timestamp, job_keywords, resume_keywords, matching_keywords, missing_keywords, match_percentage):
    with open(file_name, "w", encoding="utf-8") as report_file:
        report_file.write("Resume Keyword Matcher Report\n")
        report_file.write("=" * 35 + "\n")
        report_file.write(f"Date and Time: {timestamp}\n\n")

        report_file.write("Job Description Keywords:\n")
        report_file.write(", ".join(job_keywords) + "\n\n")

        report_file.write("Resume Keywords:\n")
        report_file.write(", ".join(resume_keywords) + "\n\n")

        report_file.write("Matching Keywords:\n")
        report_file.write(", ".join(matching_keywords) + "\n\n")

        report_file.write("Missing Keywords:\n")
        report_file.write(", ".join(missing_keywords) + "\n\n")

        report_file.write(f"Match Percentage: {match_percentage:.2f}%\n")


# This is the main function that runs the full resume keyword matching workflow.
def main():
    print("Resume Keyword Matcher")
    print("-" * 25)

    job_text = get_multiline_input("\nPaste the job description:")
    resume_text = get_multiline_input("\nPaste the resume text:")

    job_words = clean_text(job_text)
    resume_words = clean_text(resume_text)

    job_keywords = extract_keywords(job_words, top_n=30)
    resume_keywords = extract_keywords(resume_words, top_n=30)

    matching_keywords, missing_keywords, match_percentage = calculate_match(job_keywords, resume_keywords)

    print("\nJob Description Keywords:")
    print(job_keywords)

    print("\nResume Keywords:")
    print(resume_keywords)

    print("\nMatching Keywords:")
    print(matching_keywords)

    print("\nMissing Keywords:")
    print(missing_keywords)

    print(f"\nMatch Percentage: {match_percentage:.2f}%")

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    report_file_name = "resume_keyword_report.txt"

    save_report(
        report_file_name,
        timestamp,
        job_keywords,
        resume_keywords,
        matching_keywords,
        missing_keywords,
        match_percentage,
    )

    print(f"\nReport saved to {report_file_name}")


if __name__ == "__main__":
    main()
