/////8
class Email {
    constructor(email) {
        this.email = email;
    }

    // Геттер isValid
    get isValid() {
        // Проверяем, что email существует и содержит '@'
        if (!this.email || typeof this.email !== 'string' || !this.email.includes('@')) {
            return false;
        }

        // Разбиваем email на логин и домен
        const parts = this.email.split('@');
        const login = parts[0];
        const domain = parts[1];

        // Проверяем запрещенные символы в логине
        const forbiddenChars = ['*', '#', '$', '%', '^'];
        let hasForbiddenChar = false;
        for (const char of forbiddenChars) {
            if (login.includes(char)) {
                hasForbiddenChar = true;
                break; // Если нашли, дальше искать не нужно
            }
        }
        if (hasForbiddenChar) {
            return false;
        }

        // Получаем доменную зону (то, что после последней точки)
        const domainParts = domain.split('.');
        const zone = domainParts[domainParts.length - 1];

        // Проверяем длину доменной зоны
        if (zone.length > 3) {
            return false;
        }

        // Если все проверки пройдены, email валиден
        return true;
    }

    // Сеттер setEmail
    set setEmail(emailArray) {
        // Ожидаем массив вида ['login', 'domain', 'zone']
        if (Array.isArray(emailArray) && emailArray.length === 3) {
            const [login, domain, zone] = emailArray;
            this.email = `${login}@${domain}.${zone}`;
        } else {
            console.error("Ошибка: setEmail ожидает массив из трех строк (логин, домен, зона).");
            // Можно оставить email как есть или установить в null/пустую строку
            // this.email = null; 
        }
    }
}

// --- Демонстрация ---
console.log("--- Задача №8 ---");

// Экземпляр 1: Невалидный email
const email1 = new Email('user#name@example.com');
console.log(`Email: ${email1.email}`); // user#name@example.com
console.log(`Is valid? ${email1.isValid}`); // false (из-за '#')

// Экземпляр 2: Валидный email, установленный через сеттер
const email2 = new Email(''); // Начинаем с пустой строки
email2.setEmail = ['testuser', 'gmail', 'com']; // Используем сеттер
console.log(`Email: ${email2.email}`); // testuser@gmail.com
console.log(`Is valid? ${email2.isValid}`); // true

// Экземпляр 3: Невалидный email (слишком длинная зона)
const email3 = new Email('admin@example.technology');
console.log(`Email: ${email3.email}`); // admin@example.technology
console.log(`Is valid? ${email3.isValid}`); // false (из-за '.technology')

// Экземпляр 4: Использование сеттера с неправильным форматом
const email4 = new Email('initial@domain.net');
email4.setEmail = ['newuser', 'outlook']; // Неправильный массив
console.log(`Email: ${email4.email}`); // initial@domain.net (не изменился из-за ошибки)


///////9
// Наследуем класс Contact от Email
class Contact extends Email {
    constructor(email, phone) {
        // Вызываем конструктор родительского класса (Email)
        super(email); 
        // Добавляем новое свойство для телефона
        this.phone = phone;
    }

    // Геттер для определения типа телефона
    get phoneType() {
        // Если телефон не установлен или не является строкой, возвращаем "Неизвестный"
        if (typeof this.phone !== 'string' || this.phone.length === 0) {
            return "Неизвестный";
        }

        // Убираем все нецифровые символы, кроме, возможно, лидирующего "+"
        // Мы должны сначала проверить наличие "+", потом удалить все, кроме цифр.
        
        let phoneNumber = this.phone;
        let hasPlus = false;

        if (phoneNumber.startsWith('+')) {
            hasPlus = true;
            phoneNumber = phoneNumber.substring(1); // Удаляем "+"
        }

        // Удаляем все оставшиеся нецифровые символы
        phoneNumber = phoneNumber.replace(/\D/g, ''); 

        // Если после очистки остались только цифры
        if (phoneNumber.length > 0) {
            // Проверяем длину
            if (phoneNumber.length === 12) {
                return "Мобильный";
            } else if (phoneNumber.length === 18) {
                return "Городской";
            } else {
                return "Неизвестный";
            }
        } else {
            // Если после удаления всех символов ничего не осталось (например, было только "+")
            return "Неизвестный";
        }
    }
}

// --- Демонстрация ---
console.log("\n--- Задача №9 ---");

// Экземпляр 1: Мобильный телефон (длина 12 цифр)
const contact1 = new Contact('user@domain.net', '+79123456789'); 
console.log(`Phone: ${contact1.phone}, Type: ${contact1.phoneType}`); // Мобильный

// Экземпляр 2: Телефон без "+" (тоже 12 цифр) - должен быть "Неизвестный" по условию
const contact2 = new Contact('office@work.com', '89123456789'); 
console.log(`Phone: ${contact2.phone}, Type: ${contact2.phoneType}`); // Неизвестный

// Экземпляр 3: Городской телефон (длина 18 цифр)
const contact3 = new Contact('city@example.org', '+123456789012345678');
console.log(`Phone: ${contact3.phone}, Type: ${contact3.phoneType}`); // Городской

// Экземпляр 4: Телефон с другими символами и неправильной длиной
const contact4 = new Contact('invalid@test.com', '+1-800-ABC-12345');
console.log(`Phone: ${contact4.phone}, Type: ${contact4.phoneType}`); // Неизвестный

// Экземпляр 5: Телефон с длиной, не соответствующей условиям
const contact5 = new Contact('short@num.ru', '+7123456789'); // Длина 10
console.log(`Phone: ${contact5.phone}, Type: ${contact5.phoneType}`); // Неизвестный

// Экземпляр 6: Невалидный email, но телефон валидный
const contact6 = new Contact('bad#email@test.com', '+79876543210');
console.log(`Email: ${contact6.email}, Is valid? ${contact6.isValid}`); // false
console.log(`Phone: ${contact6.phone}, Type: ${contact6.phoneType}`); // Мобильный
