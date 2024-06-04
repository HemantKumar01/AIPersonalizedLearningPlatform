# Imports the Google Cloud Translation library
from google.cloud import translate
from dotenv import load_dotenv
import os

load_dotenv()


# Initialize Translation client
def translate_text_arr(
    text_arr,
) -> translate.TranslationServiceClient:
    """Translating Text."""
    client = translate.TranslationServiceClient()

    project_id = os.environ["GCLOUD_PROJECT_ID"]
    location = "global"

    parent = f"projects/{project_id}/locations/{location}"

    # Translate text from English to French
    # Detail on supported types can be found here:
    # https://cloud.google.com/translate/docs/supported-formats
    response = client.translate_text(
        request={
            "parent": parent,
            "contents": text_arr,
            "mime_type": "text/plain",  # mime types: text/plain, text/html
            "source_language_code": "en-US",
            "target_language_code": "fr",
        }
    )

    # Display the translation for each input text provided
    print(response)

    return response
