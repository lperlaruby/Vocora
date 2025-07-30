"use client";
import {Suspense, useState, useEffect} from "react";
import {useLanguage} from "@/lang/LanguageContext";
import {supabase} from "@/lib/supabase";
import {Bookmark, Lightbulb, List, MessageSquare, Mic, Sparkles, X, Plus, ChevronDown} from "lucide-react"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {useRouter} from "next/navigation";
import dashBoardTranslations from "@/lang/Dashboard";
import welcomeTranslations from "@/lang/Dashboard/welcome";
import {Navbar} from "@/components/dashboard/navbar";
import {SupportChat} from "@/components/support-chat";
import storyGenerator from "@/lang/Story-Generator/story-generator";
import {Input} from "@/components/ui/input"
import {toast} from "sonner"
import {ScrollToTop} from "@/components/scroll-to-top"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {Loader2} from "lucide-react"
import {useVocabWords} from "@/hooks/wordlist/useVocabWords";
import {useStoryGenerator} from "@/hooks/story-generator/useStoryGenerator";
import {useAudio} from "@/hooks/story-generator/useAudio";
import {useHoverWord} from "@/hooks/story-generator/useHoverDefinitions";
import ReactMarkdown from "react-markdown";
import Translations from "@/lang/Dashboard/writing";
import {useSetLanguageFromURL} from "@/hooks/useSetLanguageFromURL";
import {useSaveStory} from "@/hooks/story-generator/useSaveStory";
import {useUserPreferences} from "@/hooks/account/useUserPreferences";
import {useWritingFeedback} from "@/hooks/writing/useWritingFeedback";
import languageDisplayNames from "@/lang/Dashboard/practiceLangDisplay";
import { splitIntoWords, cleanWord } from "@/lib/utils";

function DashboardPage() {
  const languageReady = useSetLanguageFromURL();
  const {language, setLanguage} = useLanguage();
  const router = useRouter();
  const translated = dashBoardTranslations[language];
  const storyTranslated = storyGenerator[language];
  const [newWord, setNewWord] = useState("");
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [storyLength, setStoryLength] = useState<"short" | "medium" | "long">("medium");
  const [practiceLang, setPracticeLang] = useState<"en" | "es" | "zh" >("en");
  const {words, setWords, addWord, deleteWord, deleteAllWords} = useVocabWords(practiceLang || "en");
  const {story, setStory, translation, setTranslation, imageUrl, setImageUrl, highlightedStory, setHighlightedStory, loading: storyLoading, generateStory, generateImageFromStory, applyHighlighting} = useStoryGenerator();
  const {audioSrc, convertToSpeech, setAudioSrc} = useAudio();
  const {hoveredWord, setHoveredWord, definitions, handleAddHoveredWord} = useHoverWord(practiceLang, words, setWords, story || "", language);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [isStorySelected, setIsStorySelected] = useState<boolean>(false);
  const [showWriting, setShowWriting] = useState(false);
  const [showWordList, setShowWordList] = useState(false);
  const [showStoryGenerator, setShowStoryGenerator] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const {savedStories, isStorySaved, savingMessage, setSavingMessage, fetchSavedStories, handleSaveStory, handleDeleteStory, isLoading} = useSaveStory(practiceLang, language);
  const {updatePracticeLang, fetchUserData } = useUserPreferences(setPracticeLang);
  const {input, setInput, reply, loading, sendForFeedback} = useWritingFeedback(practiceLang, language);
  const langDisplay = languageDisplayNames[language];
  const [showTranslation, setShowTranslation] = useState(false);
  const [showSavedTranslation, setShowSavedTranslation] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
    };
    checkAuth();
  }, [router]);

  // Set saving message when language changes
  useEffect(() => {
    setSavingMessage(translated.saveStory);
  }, [language]);

  // Reset selected story when practice language changes
  useEffect(() => {
    setSelectedStory(null);
    setIsStorySelected(false);
  }, [practiceLang]);

  // Fetch user data and preferences
  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle switching the practice language and sync changes to the database
  const handlePracticeLangChange = async (val: "en" | "es" | "zh") => {
    setPracticeLang(val);
    setSelectedWords(new Set());
    await updatePracticeLang(val);
  };

  // Add new word to the list
  const handleAddWord = async () => {
    const trimmed = newWord.trim();
    if (!trimmed) return;

    if (words.some((w) => w.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("This word is already in your list");
      return;
    }

    const { error } = await addWord(trimmed, practiceLang);
    if (!error) {
      setNewWord("");
      toast.success("Word added");
    } else {
      toast.error("Failed to add word");
    }
  };

  // Delete a single word from the list
  const handleDeleteWord = async (word: string) => {
    await deleteWord(word);

    setSelectedWords((prev) => {
      const updated = new Set(prev);
      updated.delete(word);
      return updated;
    });

    toast.success("Deleted word");
  };

  // Delete all vocabulary words from the list
  const handleDeleteAllWords = async () => {
    const { error } = await deleteAllWords();
    if (error) {
      toast.error("Failed to delete all words");
    } else {
      toast.success("All words deleted successfully");
    }
  };
  
  // Toggle selection state for a
  const toggleWord = (word: string) => {
    setSelectedWords((prev) => {
      const newSelectedWords = new Set(prev);
      if (newSelectedWords.has(word)) {
        newSelectedWords.delete(word);
      } else {
        newSelectedWords.add(word);
      }
      return newSelectedWords;
    });
  };

  // Handle story generation
  const handleGenerateStory = async () => {
    if (selectedWords.size === 0) {
      alert(storyTranslated.listError);
      return;
    }
    const result = await generateStory(Array.from(selectedWords), storyLength, practiceLang, language);
    if (result) {
      applyHighlighting(result, selectedWords);
      await generateImageFromStory(result);
    } else {
      console.error("Failed to generate story.");
    }
  };

  // Handle audio generation
  const handleConvertToSpeech = async () => {
    if (!story) return alert(storyTranslated.speechError1);
    await convertToSpeech(story);
  };

  if (!languageReady) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 dark:text-white">
      <Navbar/>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Welcome Section */}
          <section>
            <Card className="overflow-hidden border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-600 to-violet-500 p-6 md:p-8 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{translated.greeting}</h2>
                      <p className="text-purple-100 text-lg">{translated.continue}</p>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <Select value={practiceLang} onValueChange={handlePracticeLangChange}>
                        <SelectTrigger className="w-full md:w-[180px] bg-white/20 border-white/30 text-white">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">{langDisplay["en"]}</SelectItem>
                          <SelectItem value="es">{langDisplay["es"]}</SelectItem>
                          <SelectItem value="zh">{langDisplay["zh"]}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="border-t border-purple-200 dark:border-purple-800">
                  <div className="bg-white dark:bg-slate-800 p-6">
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        className={`${
                          showWordList 
                            ? "bg-purple-500 hover:bg-purple-600 text-white" 
                            : "bg-white hover:bg-gray-100 text-black border-2 border-purple-200"
                        } shadow-md`}
                        onClick={() => {
                          setShowWordList(!showWordList);
                          setShowStoryGenerator(false);
                          setShowWriting(false);
                          setShowSaved(false);
                        }}
                      >
                        <List className="h-4 w-4 mr-2" />
                        {translated.extras.option1}
                      </Button>
                      <Button 
                        size="sm" 
                        className={`${
                          showStoryGenerator 
                            ? "bg-purple-500 hover:bg-purple-600 text-white" 
                            : "bg-white hover:bg-gray-100 text-black border-2 border-purple-200"
                        } shadow-md`}
                        onClick={() => {
                          setShowStoryGenerator(!showStoryGenerator);
                          setShowWordList(false);
                          setShowWriting(false);
                          setShowSaved(false);
                        }}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {translated.generateStoryTitle}
                      </Button>
                      <Button 
                        size="sm" 
                        className={`${
                          showWriting 
                            ? "bg-purple-500 hover:bg-purple-600 text-white" 
                            : "bg-white hover:bg-gray-100 text-black border-2 border-purple-200"
                        } shadow-md`}
                        onClick={() => {
                          setShowWriting(!showWriting);
                          setShowWordList(false);
                          setShowStoryGenerator(false);
                          setShowSaved(false);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {translated.writing}
                      </Button>
                      <Button 
                        size="sm" 
                        className={`${
                          showSaved 
                            ? "bg-purple-500 hover:bg-purple-600 text-white" 
                            : "bg-white hover:bg-gray-100 text-black border-2 border-purple-200"
                        } shadow-md`}
                        onClick={() => {
                          setShowSaved(!showSaved);
                          setShowWordList(false);
                          setShowStoryGenerator(false);
                          setShowWriting(false);
                        }}
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        {translated.extras.option2}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Main Features Grid */}
          <div className="space-y-8">
            {!showWriting && !showWordList && !showStoryGenerator && !showSaved && (
              <section>
                <Card className="border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-purple-500" />
                      {welcomeTranslations[language].title}
                    </CardTitle>
                    <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                    {welcomeTranslations[language].prompt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">{welcomeTranslations[language].guide}</h3>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                          <li className="flex items-center gap-2">
                            <List className="h-4 w-4 text-purple-500" />
                            {welcomeTranslations[language].build}
                          </li>
                          <li className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            {welcomeTranslations[language].create}
                          </li>
                          <li className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-purple-500" />
                            {welcomeTranslations[language].prac}
                          </li>
                          <li className="flex items-center gap-2">
                            <Bookmark className="h-4 w-4 text-purple-500" />
                            {welcomeTranslations[language].save}
                          </li>
                        </ul>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4">Tips</h3>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                          <li>• {welcomeTranslations[language].tip}</li>
                          <li>• {welcomeTranslations[language].storygen}</li>
                          <li>• {welcomeTranslations[language].feedback}</li>
                          <li>• {welcomeTranslations[language].saveprac}</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {showWriting && (
              <section>
                <Card className="border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <MessageSquare className="h-6 w-6 text-purple-500" />
                      {translated.writing}
                    </CardTitle>
                    <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                      {Translations[language].subheading}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={`${Translations[language].prompt} ${practiceLang}...`}
                          onKeyDown={(e) => e.key === "Enter" && sendForFeedback()}
                          className="mb-4"
                        />
                        <Button onClick={sendForFeedback} disabled={loading} className="w-full">
                          {loading ? "Checking..." : "Submit"}
                        </Button>
                      </div>

                      {reply && (
                        <div className="mt-6 w-full bg-purple-100 text-purple-900 p-4 rounded-xl shadow prose">
                          <ReactMarkdown>{reply}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {showWordList && (
              <section>
                <Card className="border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <List className="h-5 w-5 text-purple-500" />
                        {translated.extras.option1}
                      </CardTitle>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {words.length} {words.length === 1 ? translated.wordLists.word : translated.wordLists.words}
                      </div>
                    </div>
                    <CardDescription>{translated.extras.option1Description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            type="text"
                            placeholder={storyTranslated.typeWord}
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddWord();
                              }
                            }}
                            className={`${
                              newWord.trim() !== "" && words.some(word => word.toLowerCase() === newWord.trim().toLowerCase())
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                          />
                          {newWord.trim() !== "" && words.some(word => word.toLowerCase() === newWord.trim().toLowerCase()) && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                              {translated.wordLists.error}
                            </div>
                          )}
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleAddWord}
                                className="bg-purple-600 hover:bg-purple-700"
                                disabled={newWord.trim() !== "" && words.some(word => word.toLowerCase() === newWord.trim().toLowerCase())}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{translated.wordLists.add}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {words.map((word) => (
                          <div key={word} className="relative group">
                            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1.5">
                              <span className="text-slate-700 dark:text-slate-300">{word}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-5 w-5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                      onClick={() => handleDeleteWord(word)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{translated.wordLists.delete}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ))}
                        {words.length > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleDeleteAllWords}
                                  className="h-8 px-3 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  {translated.wordLists.deleteAll}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{translated.wordLists.deleteAllWords}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {words.length === 0 && (
                        <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                          {translated.wordLists.description}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {showStoryGenerator && (
              <section>
                <Card className="border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-purple-500" />
                      {translated.generateStoryTitle}
                    </CardTitle>
                    <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                      {translated.generateStoryDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Word Selection */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                        {/* Container for Title and Select All/Deselect All button */}
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                            {storyTranslated.title}
                          </h3>
                          {words.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (selectedWords.size === words.length) {
                                  setSelectedWords(new Set()); // Deselect all
                                } else {
                                  setSelectedWords(new Set(words)); // Select all (assuming words is string[])
                                }
                              }}
                              className="text-xs border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-400 dark:hover:text-white"
                            >
                              {selectedWords.size === words.length ? storyTranslated.deselectAll : storyTranslated.selectAll}
                            </Button>
                          )}
                        </div>
                        
                        {/* Word list itself */}
                        <div className="flex flex-wrap gap-2 items-center">
                          {words.map((word) => (
                            <Button
                              key={word}
                              variant={selectedWords.has(word) ? "default" : "outline"}
                              onClick={() => toggleWord(word)}
                              className={`transition-all duration-200 ${
                                selectedWords.has(word)
                                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                                  : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                              }`}
                            >
                              {word}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Story Length Selector & Conditional Clear Story Button */}
                      <div className="flex items-center justify-between gap-4">
                        {/* Story Length Selector (Left side) */}
                        <div className="flex items-center gap-x-2"> {/* Reduced gap for story length title and select */}
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{translated.storyType.title}</span>
                          <Select
                            value={storyLength}
                            onValueChange={(value) => setStoryLength(value as "short" | "medium" | "long")}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select length" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">{translated.storyType.short}</SelectItem>
                              <SelectItem value="medium">{translated.storyType.medium}</SelectItem>
                              <SelectItem value="long">{translated.storyType.long}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Clear Story Button (Right side, conditional) */}
                        {story && (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setStory("");
                              setHighlightedStory("");
                              setImageUrl(null);
                              setAudioSrc(null);
                              setStory(null); // Ensures the story section is hidden
                            }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                            title={translated.clearStory}
                          >
                            <X className="h-4 w-4 mr-2" />
                            {translated.clearStory}
                          </Button>
                        )}
                      </div>

                      {/* Generate Button */}
                      {!story && (
                        <Button
                          onClick={handleGenerateStory}
                          disabled={selectedWords.size === 0 || storyLoading}
                          className={`w-full h-12 text-lg transition-all duration-200 ${
                            selectedWords.size === 0
                              ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white"
                          }`}
                        >
                          {storyLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>{translated.generateLoad}</span>
                            </div>
                          ) : (
                            translated.generateStoryButton
                          )}
                        </Button>
                      )}

                      {/* Generated Story */}
                      {story && (
                        <div className="mt-6 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Story and Speech Controls */}
                            <div className="space-y-4">
                              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
                                {/* Original Story */}
                                <div className="text-lg text-slate-700 dark:text-slate-300 mb-6">
                                  {story && splitIntoWords(story).map((word, index) => {
                                    const cleanedWord = cleanWord(word);
                                    return cleanedWord ? (
                                      <span
                                        key={index}
                                        className={`relative inline-block cursor-pointer hover:underline ${selectedWords.has(cleanedWord) ? 'bg-yellow-300' : ''}`}
                                        onMouseEnter={() => setHoveredWord({ word: cleanedWord, index })}
                                        onMouseLeave={() => setHoveredWord(null)}
                                      >
                                        {word}
                                        {hoveredWord && hoveredWord.word === cleanedWord && hoveredWord.index === index && definitions[cleanedWord] && (
                                          <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 bg-white dark:bg-slate-800 border rounded shadow p-3 w-60 text-sm z-50">
                                            <p className="font-bold">{cleanedWord}</p>
                                            {definitions[cleanedWord]?.translatedWord && (
                                              <p className="text-sm text-gray-500 italic">({definitions[cleanedWord].translatedWord})</p>
                                            )}
                                            <p className="italic text-gray-500">{definitions[cleanedWord].partOfSpeech}</p>
                                            <p>{definitions[cleanedWord].definition}</p>

                                            <Button
                                              onClick={handleAddHoveredWord}
                                              className="mt-2 w-full text-xs bg-purple-600 hover:bg-purple-700 text-white"
                                            >
                                              {translated.wordLists.addHovered}
                                            </Button>
                                            <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rotate-45 z-[-1]" />
                                          </div>
                                        )}
                                      </span>
                                    ) : (
                                      word
                                    );
                                  })}
                                </div>

                                {/* Translation */}
                                {translation && (
                                  <div className="text-lg text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                    <Button
                                      variant="ghost"
                                      onClick={() => setShowTranslation(!showTranslation)}
                                      className="flex items-center gap-2 mb-2 hover:bg-slate-100 dark:hover:bg-slate-700 w-full justify-between"
                                    >
                                      <span>{storyTranslated.translationLabel}</span>
                                      <ChevronDown className={`h-4 w-4 transition-transform ${showTranslation ? 'rotate-180' : ''}`} />
                                    </Button>
                                    {showTranslation && (
                                      <div className="italic animate-in fade-in slide-in-from-top-1 duration-200">
                                        {translation}
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="mt-6 flex flex-col gap-4">
                                  <div className="flex gap-4">
                                    <Button
                                      onClick={handleConvertToSpeech}
                                      className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-purple-200 dark:border-purple-800"
                                      variant="outline"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Mic className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        <span>{translated.readStory}</span>
                                      </div>
                                    </Button>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        onClick={() => handleSaveStory(story, imageUrl, translated, translation)}
                                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                        variant="default"
                                      >
                                        {isStorySaved ? (
                                          <Bookmark className="h-5 w-5 fill-white" />
                                        ) : (
                                          <Bookmark className="h-5 w-5 text-purple-400" />
                                        )}
                                        <span className="ml-2">{savingMessage}</span>
                                      </Button>
                                    </div>
                                  </div>
                                  {audioSrc && (
                                    <audio controls className="w-full">
                                      <source src={audioSrc} type="audio/mpeg" />
                                      {storyTranslated.audioError}
                                    </audio>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Generated Image (Now only the image container) */}
                            {imageUrl && (
                              <div className="relative group h-full">
                                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md h-full">
                                  <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                                    <img
                                      src={imageUrl}
                                      alt="Generated story illustration"
                                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                </div>
                              </div>
                            )}
                             {!imageUrl && story && <div />} {/* Keep placeholder for grid structure if story but no image */}
                          </div>

                          {/* Regenerate Button */}
                          {story && (
                            <Button
                              onClick={handleGenerateStory}
                              disabled={selectedWords.size === 0 || storyLoading}
                              className={`w-full h-12 text-lg transition-all duration-200 ${
                                selectedWords.size === 0
                                  ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                                  : "bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white"
                              }`}
                            >
                              {storyLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                  <span>{translated.generateLoad}</span>
                                </div>
                              ) : (
                                translated.generateStoryButton
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {showSaved && (
              <section>
                <Card className="border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-purple-500" />
                      {translated.extras.option2}
                    </CardTitle>
                    <CardDescription>{translated.extras.option2Description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex">
                      {/* Left Side: */}
                      <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 pr-4">
                        <div className="space-y-4">
                          {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                              <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                            </div>
                          ) : savedStories.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                              {translated.saveStoryDescription}
                            </div>
                          ) : (
                            savedStories.map((savedStory) => (
                              <div
                                key={savedStory.id}
                                onClick={() => {
                                  if (selectedStory?.id === savedStory.id) {
                                    setSelectedStory(null);
                                    setIsStorySelected(false);
                                  } else {
                                    setSelectedStory(savedStory);
                                    setIsStorySelected(true);
                                  }
                                }}
                                className={`relative group cursor-pointer p-4 rounded-md transition-all ${
                                  selectedStory?.id === savedStory.id 
                                    ? "bg-purple-50 dark:bg-purple-900/20" 
                                    : "hover:bg-slate-100 dark:hover:bg-slate-700"
                                }`}
                              >
                                <div className="pr-6">
                                  <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
                                    {savedStory.story.split(".")[0]}.
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {new Date(savedStory.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 h-7 w-7 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteStory(savedStory.id);
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{translated.deleteStory || "Delete story"}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="w-2/3 pl-4">
                        {selectedStory ? (
                          <div className="space-y-6">
                            <div className="prose dark:prose-invert">
                              <ReactMarkdown>{selectedStory.story}</ReactMarkdown>
                            </div>

                            {selectedStory.image && (
                              <div className="flex justify-center">
                                <img
                                  src={selectedStory.image}
                                  alt={selectedStory.title || "Story Image"}
                                  className="w-2/3 h-auto object-cover rounded-lg shadow-md"
                                />
                              </div>
                            )}

                            {selectedStory.translated_story && (
                              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                                <Button
                                  variant="ghost"
                                  onClick={() => setShowSavedTranslation(!showSavedTranslation)}
                                  className="flex items-center gap-2 mb-2 hover:bg-slate-100 dark:hover:bg-slate-700 w-full justify-between"
                                >
                                  <span>{storyTranslated.translationLabel}</span>
                                  <ChevronDown className={`h-4 w-4 transition-transform ${showSavedTranslation ? 'rotate-180' : ''}`} />
                                </Button>
                                {showSavedTranslation && (
                                  <div className="text-slate-600 dark:text-slate-400 italic animate-in fade-in slide-in-from-top-1 duration-200">
                                    <ReactMarkdown>{selectedStory.translated_story}</ReactMarkdown>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                            {translated.selectStoryMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            <ScrollToTop />
          </div>

          <SupportChat />
        </div>
      </main>

      <footer className="mt-12 border-t border-purple-100 py-8 text-center text-sm text-slate-500 dark:border-purple-900 dark:text-slate-400">
        <div className="container mx-auto">
          <p>{translated.footerText}</p>
        </div>
      </footer>
    </div>
  );
}

function DashboardPageWrapper() {
  const { language, setLanguage } = useLanguage();

  return (
    <Suspense fallback={<div>{dashBoardTranslations[language].loading}</div>}>
      <DashboardPage />
    </Suspense>
  );
}

export default DashboardPageWrapper;