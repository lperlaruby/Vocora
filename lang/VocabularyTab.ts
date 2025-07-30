"use client";

import { use } from "chai";

// lang/VocabularyTab.ts

const vocabTabTranslations = {
  en: {
    vocabTab: "Vocab Tab",
    createList: "Create List",
    vocabLists: "Your Vocab Lists:",
    noVocabLists: "No vocab lists available.",
    addWord: "Add Word",
    wordsInList: "Words in List:",
    noWordsInList: "No words available in this list.",
    close: "Close",
    dragWords: "Drag words here to add them to this list",
    listName: "Please enter a list name.",
    userError: "User is not authenticated.",
    addWordError: "Please enter a word and select a list.",
    addListNamePlaceholder: "Enter list name"
  },
  es: {
    vocabTab: "Pestaña de Vocabulario",
    createList: "Crear Lista",
    vocabLists: "Tus Listas de Vocabulario:",
    noVocabLists: "No hay listas de vocabulario disponibles.",
    addWord: "Agregar Palabra",
    wordsInList: "Palabras en la Lista:",
    noWordsInList: "No hay palabras disponibles en esta lista.",
    close: "Cerrar",
    dragWords: "Arrastre palabras aquí para agregarlas a esta lista",
    listName: "Por favor, ingrese un nombre de lista.",
    userError: "El usuario no está autenticado.",
    addWordError: "Por favor, ingrese una palabra y seleccione una lista.",
    addListNamePlaceholder: "Ingrese el nombre de la lista"
  },
  zh: {
    vocabTab: "词汇表",
    createList: "创建列表",
    vocabLists: "您的词汇表：",
    noVocabLists: "没有可用的词汇表。",
    addWord: "添加单词",
    wordsInList: "列表中的单词：",
    noWordsInList: "此列表中没有可用的单词。",
    close: "关闭",
    dragWords: "将单词拖动到此处以将其添加到此列表",
    listName: "请输入列表名称。",
    userError: "用户未经过身份验证。",
    addWordError: "请输入一个单词并选择一个列表。",
    addListNamePlaceholder: "输入列表名称",
  },
} as const;

export default vocabTabTranslations;
