import google.generativeai as genai
import os

# Đảm bảo đã set API KEY
# Truyền trực tiếp chuỗi string vào
genai.configure(api_key="AIzaSyCBYjZ73GMVrWbnJDSnwMVZ_gLLzTmRUdk")

print("Danh sách các model khả dụng:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)