📱 FamilyTask — поточний стан розробки

🧠 Загальна концепція

FamilyTask — мобільний додаток для сімейного планування задач із гейміфікацією.

Основні ідеї:
- задачі для членів сімʼї
- XP / бали
- streak / серії виконання
- leaderboard / сімейне змагання
- профілі членів сімʼї
- календар задач

🚀 ФАЗА 1 — База + Backend ✅ ЗАВЕРШЕНО

🔧 Проєкт

Створено проєкт на Expo / React Native.

Використовується:
- Expo Router
- TypeScript
- Supabase
- NativeWind / Tailwind

Поточна структура:

app/
src/
  screens/
  components/
  lib/

🗄 Supabase

Підключено Supabase.

Використовується:
- Supabase Auth
- PostgreSQL
- RLS / Row Level Security

📊 Таблиця profiles

Створено таблицю profiles:

profiles (
  id UUID,
  name TEXT,
  avatar_emoji TEXT,
  role TEXT,
  points_total INTEGER,
  streak_days INTEGER
)

Також налаштовано базові політики доступу.

🔐 ФАЗА 2 — Auth ✅ ЗАВЕРШЕНО

Реалізовано повноцінну базову авторизацію.

1. RegisterScreen

Реалізовано:
- поле імені
- email
- password
- валідацію
- чекбокс умов
- створення користувача через Supabase Auth
- редірект після реєстрації на /home

2. LoginScreen

Реалізовано:
- вхід через email + password
- обробку помилок
- редірект після входу на /home

3. Автологін

У файлі app/index.tsx реалізовано перевірку session.

Логіка:
- якщо session є → /home
- якщо session немає → /welcome

4. Logout

Реалізовано вихід через Supabase:

supabase.auth.signOut()

Після logout користувача редіректить на /login.

📱 Поточні екрани

✅ WelcomeScreen

Стартовий екран.

Є кнопки:
- “Почати” → /register
- “Вже є акаунт” → /login

✅ RegisterScreen

Екран створення акаунта.

Є:
- імʼя
- email
- пароль
- чекбокс умов
- реєстрація через Supabase

Після успішної реєстрації:
- перехід на /home

✅ LoginScreen

Екран входу.

Є:
- email
- пароль
- логін через Supabase

Після успішного входу:
- перехід на /home

✅ HomeScreen

На HomeScreen зараз реалізовано:
- отримання користувача через supabase.auth.getUser()
- показ email користувача
- кнопка logout

⚙️ Важливі технічні рішення

1. Email confirmation вимкнено

У Supabase вимкнено підтвердження email:

Supabase → Auth → Email → Confirm email OFF

Це зроблено, щоб спростити розробку на старті.

2. Помилка 401 Unauthorized на profiles

Було виправлено проблему з доступом до profiles.

Рішення:
- прибрали ручний insert у profiles на етапі реєстрації
- поки що працюємо тільки з Auth
- логіку створення профілю плануємо доробити пізніше правильно через RLS / trigger / окрему функцію

3. Помилка window is not defined

Було виправлено проблему, повʼязану з web-середовищем.

Рішення:
- додано Platform
- налаштовано storage для Supabase

4. React error: object as child

Була помилка через спробу вивести object у JSX.

Рішення:
- замість user виводимо конкретне поле:

user?.email

🎨 UX / UI

Використовується готовий UX-дизайн для основних екранів:

- Welcome
- Login
- Register
- Family Setup
- Home
- Calendar
- Tasks

Підключено:
- NativeWind / Tailwind
- кастомні компоненти Button
- кастомні компоненти Typo

🚧 Наступний етап

Наступний великий етап:

👨‍👩‍👧 Family Setup

Потрібно реалізувати:

1. Перевірку, чи має користувач сімʼю
2. Якщо family_id немає → показати Family Setup
3. Створення сімʼї
4. Вступ у сімʼю за invite_code
5. Запис family_id у profiles
6. Після створення або вступу → перехід на /home

Після Family Setup наступні етапи:

1. Tasks
2. Calendar
3. XP / streak
4. Leaderboard
5. Push notifications
6. Badges / achievements

💡 Поточний статус

На цей момент:

✅ Auth працює
✅ Навігація працює
✅ Supabase підключено
✅ Базовий backend є
✅ UX-екрани є
✅ Проєкт готовий до core features

Наступна задача:

“Ми на етапі Family Setup. Допоможи реалізувати створення сімʼї та вступ у сімʼю через invite_code.”