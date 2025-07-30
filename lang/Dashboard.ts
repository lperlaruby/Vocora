"use client";

const dashBoardTranslations = {
    en: {
        navBar: {
            progressDays: "Day 12",
            settings: "Settings",
            profile: "Profile",
            logout: "Logout",
            account: "Account",
            dashboard: "Dashboard",
        },
        
        greeting: "Welcome back!",
        continue: "Continue your language journey",
        progress: "Daily Progress",
        speaking: "Speaking",
        reading: "Reading",
        writing: "Writing",
        quiz: "Quiz",
        practice: "Practice",

        languageLevels: {
            Beginner: "Beginner",
            Intermediate: "Intermediate",
            Advanced: "Advanced",
        },

        practiceLevels: {
            level1: "Perfect for newcomers",
            level2: "Enhance your skills",
            level3: "Master the language",
        },

        start: "Start Lesson",
        generateStory: "Generate a story in",
        generateStoryDescription: "Create a custom story to practice reading and vocabulary",

        storyType: {
            title: "Story Length:",
            short: "Short Story",
            medium: "Medium Story",
            long: "Long Story",
        },

        generateStoryTitle: "Story Generator",
        generateStoryButton: "Generate Story",
        generateLoad: "Generating...",
        readStory: "Read Out Loud",
        saveStory: "Save Story",
        savedStory: "Story Saved",
        savedTitle: "Saved Stories",
        clearStory: "Clear Story",
        saveStoryDescription: "No saved stories yet. Generate and save some stories to see them here!",
        selectStoryMessage: "Please select a story to view more!",
        
        extras: {
            option1: "Words Lists",
            option1Button: "View Words",
            option1Description: "Add and manage your vocabulary words",
            option2: "Saved Items",
            option2Button: "View saved",
            option2Description: "Access your bookmarked lessons and words",
        },

        wordLists: {
           error: "Word already in list",
           add: "Add word to list",
           addHovered: "Add to List",
           delete: "Delete word",
           deleteAll: "Delete All",
           deleteAllWords: "Delete all words",
           description: "No words in your list yet. Add some words to get started!",
           word: "word",
           words: "words",
        },

        loading: "Loading...",
        footerText: "Built with ❤️ by Vocora - 2025",
        deleteStory: "Delete Story",
    },
    es: {
        navBar:{
            progressDays: "Día 12",
            settings: "Configuraciones",
            profile: "Perfil",
            logout: "Cerrar sesión",
            account: "Cuenta",
            dashboard: "Tablero",
        },

        greeting: "¡Bienvenido de nuevo!",
        continue: "Continúa tu viaje de idiomas",
        progress: "Progreso diario",
        speaking: "Hablando",
        reading: "Leyendo",
        writing: "Escribiendo",
        quiz: "Cuestionario",
        practice: "Práctica",

        languageLevels: {
            Beginner: "Principiante",
            Intermediate: "Intermedio",
            Advanced: "Avanzado",
        },

        practiceLevels: {
            level1: "Perfecto para principiantes",
            level2: "Mejora tus habilidades",
            level3: "Domina el idioma",
        },


        start: "Iniciar lección",
        generateStory: "Generar una historia en",
        generateStoryDescription: "Crea una historia personalizada para practicar la lectura y el vocabulario",
        generateLoad: "Generando...",
        readStory: "Leer en voz alta",
        saveStory: "Guardar historia",
        savedStory: "Historia guardada",
        savedTitle: "Historias guardadas",
        clearStory: "Borrar historia",
        saveStoryDescription: "No hay historias guardadas aún. ¡Genera y guarda algunas historias para verlas aquí!",
        selectStoryMessage: "¡Por favor selecciona una historia para ver más!",

        storyType: {
            title: "Longitud de la historia:",
            short: "Cuento corto", 
            medium: "Cuento mediano",
            long: "Cuento largo",
        },

        generateStoryTitle: "Generador de historias",
        generateStoryButton: "Generar historia",

       extras :{
            option1: "Listas de palabras",
            option1Button: "Ver palabras",
            option1Description: "Agrega y gestiona tus palabras de vocabulario",
            option2: "Artículos guardados",
            option2Button: "Ver guardados",
            option2Description: "Accede a tus lecciones y palabras guardadas",
       },

        wordLists: {
            error: "Palabra ya en la lista",
            add: "Agregar palabra a la lista",
            addHovered: "Agregar a la lista",
            delete: "Eliminar palabra",
            deleteAll: "Eliminar todo",
            deleteAllWords: "Eliminar todas las palabras",
            description: "No hay palabras en tu lista aún. ¡Agrega algunas palabras para comenzar!",
            word: "palabra",
            words: "palabras",
        },

        loading: "Cargando...",
        footerText: "Construido con ❤️ por Vocora - 2025",
        deleteStory: "Eliminar historia",
    },
    zh: {
        navBar:{
            progressDays: "第12天",
            settings: "设置",
            profile: "个人资料",
            logout: "登出",
            account: "账户",
            dashboard: "仪表板",
        },

        greeting: "欢迎回来！",
        continue: "继续你的语言之旅",
        progress: "每日进度",
        speaking: "口语",
        reading: "阅读",
        writing: "写作",
        quiz: "测验",
        practice: "练习",

        languageLevels: {
            Beginner: "初学者",
            Intermediate: "中级",
            Advanced: "高级",
        },

        practiceLevels: {
            level1: "适合新手",
            level2: "提升你的技能",
            level3: "掌握语言",
        },

        start: "开始课程",
        generateStory: "生成一个故事在",
        generateStoryDescription: "创建一个自定义故事来练习阅读和词汇",
        generateLoad: "生成中...",
        readStory: "大声朗读",
        saveStory: "保存故事",
        savedStory: "故事已保存",
        savedTitle: "已保存的故事",
        clearStory: "清除故事",
        saveStoryDescription: "还没有保存的故事。生成并保存一些故事以在这里查看它们！",
        selectStoryMessage: "请选择一个故事以查看更多内容！",

        storyType: {
            title: "故事长度：",
            short: "短篇故事",
            medium: "中篇故事",
            long: "长篇故事",
        },

        generateStoryTitle: "生成故事",
        generateStoryButton: "生成故事",

        extras: {
            option1: "单词列表",
            option1Button: "查看单词",
            option1Description: "添加和管理你的词汇单词",
            option2: "保存的项目",
            option2Button: "查看已保存",
            option2Description: "访问你书签的课程和单词",
        },

        wordLists: {
            error: "单词已在列表中",
            add: "将单词添加到列表",
            addHovered: "添加到列表",
            delete: "删除单词",
            deleteAll: "删除所有",
            deleteAllWords: "删除所有单词",
            description: "你的列表中还没有单词。添加一些单词以开始！",
            word: "单词",
            words: "单词",
        },

        loading: "加载中...",
        footerText: "由Vocora - 2025 ❤️构建",
        deleteStory: "删除故事",
    },
  };
  
  export default dashBoardTranslations;
  