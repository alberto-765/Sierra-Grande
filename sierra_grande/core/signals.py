# signals.py
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.translation import get_language
from modeltrans.utils import get_translation_fields
from django.conf import settings

from oscar.core.loading import get_model

import deepl
from tinymce.widgets import TinyMCE


DEEPL_AUTH_KEY = "your-deepl-api-key"
deepl_translator = deepl.Translator(DEEPL_AUTH_KEY)


MODELTRANS_LANGUAGES = getattr(settings, "MODELTRANS_AVAILABLE_LANGUAGES", [])
DEFAULT_LANG = getattr(settings, "MODELTRANS_DEFAULT_LANGUAGE", "es")
DEEPL_LANG_MAP = getattr(settings, "DEEPL_LANG_MAP", {})


def get_translatable_models():
    Product = get_model("catalogue", "Product")
    ProductClass = get_model("catalogue", "ProductClass")
    ProductAttribute = get_model("catalogue", "ProductAttribute")
    Category = get_model("catalogue", "Category")
    ProductCategory = get_model("catalogue", "ProductCategory")
    ProductImage = get_model("catalogue", "ProductImage")
    AttributeOptionGroup = get_model("catalogue", "AttributeOptionGroup")
    AttributeOption = get_model("catalogue", "AttributeOption")
    Option = get_model("catalogue", "Option")
    Partner = get_model("partner", "Partner")
    ConditionalOffer = get_model("offer", "ConditionalOffer")
    Range = get_model("offer", "Range")
    VoucherSet = get_model("voucher", "VoucherSet")
    Voucher = get_model("voucher", "Voucher")

    # Añade aquí todos los modelos extendidos de Oscar que usen modeltrans
    return [
        Product,
        ProductClass,
        ProductAttribute,
        Category,
        ProductCategory,
        ProductImage,
        AttributeOptionGroup,
        AttributeOption,
        Option,
        Partner,
        ConditionalOffer,
        Range,
        VoucherSet,
        Voucher,
    ]


def translate_field(text, target_lang, is_html=False):
    if not text:
        return ""

    deepl_lang = DEEPL_LANG_MAP.get(target_lang)
    if not deepl_lang:
        return text

    try:
        return deepl_translator.translate_text(
            text,
            target_lang=deepl_lang,
            tag_handling="html" if is_html else None,
        ).text
    except Exception as e:
        print(f"[Translation Error] {target_lang}: {e}")
        return text


@receiver(pre_save)
def auto_translate_model_fields(sender, instance, **kwargs):
    if sender not in get_translatable_models():
        return

    trans_fields = get_translation_fields(sender)

    for field in trans_fields:
        if field.endswith(f"_{DEFAULT_LANG}"):
            base_field = field[: -len(f"_{DEFAULT_LANG}")]
            source_value = getattr(instance, field)
            if not source_value:
                continue

            is_html = isinstance(field.widget, TinyMCE)

            for lang in MODELTRANS_LANGUAGES:
                if lang == DEFAULT_LANG:
                    continue
                trans_field = f"{base_field}_{lang}"
                if not getattr(instance, trans_field):
                    translated_value = translate_field(
                        source_value, lang, is_html=is_html
                    )
                    setattr(instance, trans_field, translated_value)
