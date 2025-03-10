const languages = {
  vi: import.meta.globEager('./language/vi/*.js'),
  en: import.meta.globEager('./language/en/*.js'),
}
const importLangFiles = lang => {
  let messages = {}
  const modules = languages[lang]

  for (const path in modules) {
    const moduleName = path.replace(new RegExp(`^\\.\\/language\\/${lang}\\/([^\\/]+)\\.js$`), '$1')

    if (moduleName.includes('index')) {
      messages = modules[path].default
    } else {
      messages = { ...messages, ...modules[path].default }
    }
  }

  return messages
}
Object.keys(languages).forEach(lang => {
  languages[lang] = importLangFiles(lang)
})
export default languages
