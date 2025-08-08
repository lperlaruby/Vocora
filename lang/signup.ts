// lang/signup_tr.ts
"use client";

const signupTranslations = {
    en: {
      title: "Sign up",
      description: "Enter your information below to create your account",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      emailLabel: "Email",
      emailPlaceholder: "m@example.com",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      passwordMismatch: "Passwords do not match",
      signIn: "Sign In",
      googleSignUp: "Sign up with Google",
      continueOption: "Or continue with",
      signUpButton: "Sign Up",
      signInLink: "Already have an account?",
      unexpectedError: "An unexpected error occurred",
      footerText: "Built with ❤️ by Vocora - 2025",
      passwordTitle: "Password must include",
      passwordRequirements: [
        "At least 6 characters",
        "At least one lower case letter [a-z]",
        "At least one upper case letter[A-Z]",
        "At least one numeral [0-9]",
        "At least one special character [~!@#^-&*()_]",
      ],
      // Add these new fields:
      interfaceLanguageLabel: "App Interface Language",
      interfaceLanguageDescription: "What language should the app be displayed in?",
      practiceLanguageLabel: "Learning Language", 
      practiceLanguageDescription: "What language would you like to practice?",
      languageOptions: {
        english: "English",
        spanish: "Spanish", 
        chinese: "Chinese"
      },
      // Language setup page translations
      languageSetupTitle: "Language Preferences",
      languageSetupDescription: "Let's set up your language preferences to personalize your experience.",
      continueButton: "Continue to Dashboard",
      savingButton: "Saving..."
    },
    es: {
      title: "Regístrate",
      description: "Ingresa tu información a continuación para crear tu cuenta",
      firstNameLabel: "Nombre",
      lastNameLabel: "Apellido",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "m@ejemplo.com",
      passwordLabel: "Contraseña",
      confirmPasswordLabel: "Confirmar Contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      passwordMismatch: "Las contraseñas no coinciden",
      signIn: "Iniciar sesión",
      googleSignUp: "Regístrate con Google",
      continueOption: "O continúa con",
      signUpButton: "Regístrate",
      signInLink: "¿Ya tienes una cuenta?",
      unexpectedError: "Ocurrió un error inesperado",
      footerText: "Construido con ❤️ por Vocora - 2025",
      passwordTitle: "La contraseña debe incluir",
      passwordRequirements: [
        "Al menos 6 caracteres",
        "Al menos una letra minúscula [a-z]",
        "Al menos una letra mayúscula [A-Z]",
        "Al menos un número [0-9]",
        "Al menos un carácter especial [~!@#^-&*()_]",
      ],
      // Add these new fields:
      interfaceLanguageLabel: "Idioma de la interfaz",
      interfaceLanguageDescription: "¿En qué idioma debe mostrarse la aplicación?",
      practiceLanguageLabel: "Idioma de aprendizaje",
      practiceLanguageDescription: "¿Qué idioma te gustaría practicar?",
      languageOptions: {
        english: "Inglés",
        spanish: "Español",
        chinese: "Chino"
      },
      // Language setup page translations
      languageSetupTitle: "Preferencias de Idioma",
      languageSetupDescription: "Configuremos tus preferencias de idioma para personalizar tu experiencia.",
      continueButton: "Continuar al Tablero",
      savingButton: "Guardando..."
    },
    zh: {
      title: "注册",
      description: "在下面输入您的信息以创建帐户",
      firstNameLabel: "名字",
      lastNameLabel: "姓氏",
      emailLabel: "电子邮件",
      emailPlaceholder: "m@示例.com",
      passwordLabel: "密码",
      confirmPasswordLabel: "确认密码",
      showPassword: "显示密码",
      hidePassword: "隐藏密码",
      passwordMismatch: "密码不匹配",
      signIn: "登录",
      googleSignUp: "使用谷歌注册",
      signUpButton: "注册",
      continueOption: "或继续使用",
      signInLink: "已经有账户？",
      unexpectedError: "发生了意外错误",
      footerText: "由 Vocora ❤️ 构建 - 2025",
      passwordTitle: "密码必须包括",
      passwordRequirements: [
        "至少 6 个字符",
        "至少一个小写字母 [a-z]",
        "至少一个大写字母 [A-Z]",
        "至少一个数字 [0-9]",
        "至少一个特殊字符 [~!@#^-&*()_]",
      ],
      // Add these new fields:
      interfaceLanguageLabel: "界面语言",
      interfaceLanguageDescription: "应用应该用什么语言显示？",
      practiceLanguageLabel: "学习语言", 
      practiceLanguageDescription: "你想练习什么语言？",
      languageOptions: {
        english: "英语",
        spanish: "西班牙语",
        chinese: "中文"
      },
      // Language setup page translations
      languageSetupTitle: "语言偏好",
      languageSetupDescription: "让我们设置您的语言偏好来个性化您的体验。",
      continueButton: "继续到仪表板",
      savingButton: "保存中..."
    },
  } as const; // Use 'as const' to make the structure readonly
  
  export default signupTranslations;
  