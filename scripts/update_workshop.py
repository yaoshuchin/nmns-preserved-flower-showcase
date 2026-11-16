# -*- coding: utf-8 -*-
with open('js/slides_data.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('"策展核心"', '"研習核心"')
text = text.replace('"策展總結"', '"研習總結"')
text = text.replace('南投國中 1151116 教師研習成果', '南投國中 1151116 教師校內研習')
text = text.replace('引導學員與參觀民眾', '引導全校教師夥伴')
text = text.replace('研習定位：南投國中數學領域教師研習成果公開特展。', '研習定位：南投國中 115 學年度數學領域教師校內增能研習。')
text = text.replace('【講者備忘】歡迎來到南投國中永生花跨領域手作研習！', '【講者備忘】歡迎各位老師參加南投國中永生花跨領域教師校內研習！')
text = text.replace('展覽思考：', '手作思考：')
text = text.replace('研習閉幕綜覽：STEAM 跨域成果量表、多元評量與生活延伸', '校內研習閉幕綜覽：STEAM 跨域成果量表、多元評量與教學實踐')
text = text.replace('南投國中校園現場展示與線上數位典藏，將師生手作成果完整記錄推廣。', '南投國中校園現場成果展示與線上數位典藏，將教師手作成果完整記錄分享。')
text = text.replace('【講者備忘】恭喜各位學員完成 15 頁完整學習大綱！感謝南投國中研習團隊的用心付出', '【講者備忘】恭喜各位老師完成 15 頁完整學習大綱！感謝南投國中全體研習夥伴的用心參與')

with open('js/slides_data.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated js/slides_data.js')

# Update gallery_data.js
with open('js/gallery_data.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('特展主視覺', '研習主視覺')
text = text.replace('手作特展', '校內研習')
text = text.replace('生活與策展情境', '校園與生活情境')
text = text.replace('展覽質感', '精緻美感')
text = text.replace('展台陳列', '作品陳列')

with open('js/gallery_data.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated js/gallery_data.js')

# Update README.md
with open('README.md', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('永生花跨領域美感手作特展', '永生花跨領域美感教師校內研習成果網')
text = text.replace('官方公開展示網址', '校內研習成果公開網址')
text = text.replace('策展緣起與核心主題', '校內研習緣起與核心主題')
text = text.replace('本系統為**南投縣立南投國民中學數學領域教師研習／手作課程**之數位成果展示系統，由南投國中數學領域輔導團隊策劃執行。', '本系統為**南投縣立南投國民中學 115 學年度數學領域教師校內在職增能研習**之數位成果網，由南投國中數學領域教學輔導團隊主辦策劃。')
text = text.replace('生活花藝與策展情境', '校園花藝與生活情境')
text = text.replace('南投國中永生花公開展示主題成果展示系統', '南投國中 1151116 永生花教師校內研習成果系統')

with open('README.md', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated README.md')

# Update css/style.css
with open('css/style.css', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('南投國中數學領域教師研習 ‧ 永生花跨領域手作特展', '南投國中數學領域 1151116 教師校內研習 ‧ 永生花美感手作成果')
with open('css/style.css', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated css/style.css')

# Update js/app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('南投國中數學領域教師研習 ‧ 永生花跨領域手作特展', '南投國中數學領域 1151116 教師校內研習 ‧ 永生花美感手作成果')
with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated js/app.js')
