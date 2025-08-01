"use client";

// lang/home.ts

const settingsTranslations = {
    en: {
      title: "Settings",
      lang_opt: "Select Language",
      close: "Close",
      language: "Language",
      practiceLanguage: "Practice Language",
      languages: {
        english: "English",
        spanish: "Spanish",
        mandarin: "Mandarin",
      },
      // Extended translations for full settings modal
      accountInfo: {
        title: "Account Information",
        emailLabel: "Email Address",
        loading: "Loading..."
      },
      changePassword: {
        title: "Change Password",
        description: "Update your password to keep your account secure",
        currentPassword: "Current Password",
        newPassword: "New Password",
        confirmPassword: "Confirm New Password",
        currentPasswordPlaceholder: "Enter current password",
        newPasswordPlaceholder: "Enter new password",
        confirmPasswordPlaceholder: "Confirm new password",
        changeButton: "Change Password",
        changingButton: "Changing Password..."
      },
      appearance: {
        title: "Appearance",
        description: "Choose between light and dark mode",
        darkMode: "Dark Mode",
        toggleDescription: "Toggle between light and dark theme"
      },
      languagePreferences: {
        title: "Language Preferences",
        description: "Set your preferred interface language",
        interfaceLanguage: "Interface Language",
        selectLanguage: "Select language",
        saveButton: "Save Language Preference",
        savingButton: "Saving...",
        loadingButton: "Loading...",
        unsavedChanges: "Unsaved changes"
      },
      practiceLanguageSection: {
        title: "Practice Language",
        description: "Choose the language you want to practice and learn",
        selectPracticeLanguage: "Select practice language",
        updating: "Updating practice language..."
      }
    },
    es: {
      title: "Configuraciones",
      lang_opt: "Seleccionar idioma",
      close: "Cerrar",
      language: "Idioma",
      practiceLanguage: "Idioma de práctica",
      languages: {
        english: "Inglés",
        spanish: "Español",
        mandarin: "Mandarín",
      },
      // Extended translations for full settings modal
      accountInfo: {
        title: "Información de la cuenta",
        emailLabel: "Dirección de correo electrónico",
        loading: "Cargando..."
      },
      changePassword: {
        title: "Cambiar contraseña",
        description: "Actualiza tu contraseña para mantener tu cuenta segura",
        currentPassword: "Contraseña actual",
        newPassword: "Nueva contraseña",
        confirmPassword: "Confirmar nueva contraseña",
        currentPasswordPlaceholder: "Ingrese la contraseña actual",
        newPasswordPlaceholder: "Ingrese la nueva contraseña",
        confirmPasswordPlaceholder: "Confirme la nueva contraseña",
        changeButton: "Cambiar contraseña",
        changingButton: "Cambiando contraseña..."
      },
      appearance: {
        title: "Apariencia",
        description: "Elige entre modo claro y oscuro",
        darkMode: "Modo oscuro",
        toggleDescription: "Alternar entre tema claro y oscuro"
      },
      languagePreferences: {
        title: "Preferencias de idioma",
        description: "Establece tu idioma de interfaz preferido",
        interfaceLanguage: "Idioma de la interfaz",
        selectLanguage: "Seleccionar idioma",
        saveButton: "Guardar preferencia de idioma",
        savingButton: "Guardando...",
        loadingButton: "Cargando...",
        unsavedChanges: "Cambios no guardados"
      },
      practiceLanguageSection: {
        title: "Idioma de práctica",
        description: "Elige el idioma que quieres practicar y aprender",
        selectPracticeLanguage: "Seleccionar idioma de práctica",
        updating: "Actualizando idioma de práctica..."
      }
    },
    zh: {
      title: "设置",
      lang_opt: "选择语言",
      close: "关闭",
      language: "语言",
      practiceLanguage: "练习语言",
      languages: {
        english: "英语",
        spanish: "西班牙语",
        mandarin: "普通话",
      },
      // Extended translations for full settings modal
      accountInfo: {
        title: "账户信息",
        emailLabel: "电子邮件地址",
        loading: "加载中..."
      },
      changePassword: {
        title: "更改密码",
        description: "更新您的密码以保持账户安全",
        currentPassword: "当前密码",
        newPassword: "新密码",
        confirmPassword: "确认新密码",
        currentPasswordPlaceholder: "输入当前密码",
        newPasswordPlaceholder: "输入新密码",
        confirmPasswordPlaceholder: "确认新密码",
        changeButton: "更改密码",
        changingButton: "更改密码中..."
      },
      appearance: {
        title: "外观",
        description: "在浅色和深色模式之间选择",
        darkMode: "深色模式",
        toggleDescription: "在浅色和深色主题之间切换"
      },
      languagePreferences: {
        title: "语言偏好",
        description: "设置您首选的界面语言",
        interfaceLanguage: "界面语言",
        selectLanguage: "选择语言",
        saveButton: "保存语言偏好",
        savingButton: "保存中...",
        loadingButton: "加载中...",
        unsavedChanges: "未保存的更改"
      },
      practiceLanguageSection: {
        title: "练习语言",
        description: "选择您想要练习和学习的语言",
        selectPracticeLanguage: "选择练习语言",
        updating: "更新练习语言中..."
      }
    },
  } as const;
  
  export default settingsTranslations;
  