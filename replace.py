import os
import re

base_path = r'D:\Personal\Car-Rental.Lerviz\Frontend\src\components'

replacements = {
    'About.jsx': {
        'import_statements': "import aboutImage from '../assets/images/about_image.avif';\n",
        'replacements': [
            (r'src="https://framerusercontent\.com/images/[^"]+"', 'src={aboutImage}')
        ]
    },
    'Blog.jsx': {
        'import_statements': "import blogImage1 from '../assets/images/blog_image1.webp';\nimport blogImage2 from '../assets/images/blog_image2.webp';\n",
        'replacements': [
            (r'"https://framerusercontent\.com/images/KAg6M1Og2Wm09U2r4ebOYrXJ0O0\.webp"', 'blogImage1'),
            (r'"https://framerusercontent\.com/images/uAUOdBLRaREeRCvYD8xpju2am3A\.webp"', 'blogImage2')
        ]
    },
    'ChoseUs.jsx': {
        'import_statements': "import whychoseus1 from '../assets/images/whychoseus.avif';\nimport whychoseus2 from '../assets/images/whychoseus2.avif';\nimport whychoseus3 from '../assets/images/whychoseus3.avif';\nimport whychoseus4 from '../assets/images/whychoseus4.avif';\n",
        'replacements': [
            (r'"https://framerusercontent\.com/images/p2zVxW5GfLqiJQjAb4ceXzAV28\.jpg"', 'whychoseus1'),
            (r'"https://framerusercontent\.com/images/4OFvMIaRayQ0f2o7F9Rn8GFDNI\.jpg"', 'whychoseus2'),
            (r'"https://framerusercontent\.com/images/ETAkL6ocKle9hFoTeTN9seAxRZc\.webp"', 'whychoseus3'),
            (r'"https://framerusercontent\.com/images/6J3wpAEtDoifWCoRoFkUas3sc\.webp"', 'whychoseus4')
        ]
    },
    'CtaSection.jsx': {
        'import_statements': "import ctaImage from '../assets/images/cta_image.webp';\n",
        'replacements': [
            (r'src="https://framerusercontent\.com/images/[^"]+"', 'src={ctaImage}')
        ]
    },
    'Intro.jsx': {
        'import_statements': "import logoImage from '../assets/images/Lerviz_logo.avif';\n",
        'replacements': [
            (r'src="https://framerusercontent\.com/images/[^"]+"', 'src={logoImage}')
        ]
    },
    'Inventory.jsx': {
        'import_statements': "import inventory1 from '../assets/images/inventory1.avif';\nimport inventory2 from '../assets/images/inventory2.jpg';\nimport inventory3 from '../assets/images/inventory3.jpg';\n",
        'replacements': [
            (r'"https://framerusercontent\.com/images/2qaOY29IxvV9sFJrKBsLiQXaSw\.jpg"', 'inventory1'),
            (r'"https://framerusercontent\.com/images/iuCR1PM3FAVHTBueXbuukfuD7Y8\.jpg"', 'inventory2'),
            (r'"https://framerusercontent\.com/images/nniBMDKFMcgHgLnujuthibms05Y\.jpg"', 'inventory3')
        ]
    },
    'SpecialOffers.jsx': {
        'import_statements': "import specialOffer from '../assets/images/special_offer.avif';\n",
        'replacements': [
            (r'"https://framerusercontent\.com/images/[^"]+"', 'specialOffer')
        ]
    },
    'VideoHero.jsx': {
        'import_statements': "import heroVideo from '../assets/videos/hero.mp4';\nimport posterImage from '../assets/images/video_hero_image.avif';\n",
        'replacements': [
            (r'src="https://framerusercontent\.com/assets/[^"]+"', 'src={heroVideo}'),
            (r'poster="https://framerusercontent\.com/images/[^"]+"', 'poster={posterImage}')
        ]
    }
}

for file_name, config in replacements.items():
    file_path = os.path.join(base_path, file_name)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        last_import_index = 0
        for match in re.finditer(r'^import .*;\n?', content, re.MULTILINE):
            last_import_index = match.end()
            
        content = content[:last_import_index] + config['import_statements'] + content[last_import_index:]
        
        for pattern, replacement in config['replacements']:
            content = re.sub(pattern, replacement, content)
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file_name}')
    else:
        print(f'File {file_name} not found')