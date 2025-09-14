#!/bin/bash

# Скрипт для обновления деплоя Cutra

echo "🚀 Начинаем обновление Cutra..."

# Обновление Backend
echo "📦 Обновляем Backend..."
cd cutra-backend
git add .
git commit -m "Backend update: $(date)"
git push origin main

# Если есть Fly CLI
if command -v flyctl &> /dev/null; then
    echo "✈️ Деплоим на Fly.io..."
    flyctl deploy --app app-xjeartav
else
    echo "⚠️ Fly CLI не установлен. Backend обновится через GitHub Actions (если настроен)"
fi

cd ..

# Обновление Frontend
echo "🎨 Обновляем Frontend..."
cd cutra-frontend
git add .
git commit -m "Frontend update: $(date)"
git push origin main

echo "✅ Обновление завершено!"
echo "Frontend: https://d-hairstyles-app-1nm8wwdp.devinapps.com"
echo "Backend: https://app-xjeartav.fly.dev"
echo "Admin: https://app-xjeartav.fly.dev/admin"
