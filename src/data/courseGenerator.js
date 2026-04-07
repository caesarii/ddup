import commonHanziConfig from './commonHanzi1000.json'

export function generateHanziLessons({
  lessonCount = 20,
  charsPerLesson = 10,
  startIndex = 0,
} = {}) {
  const chars = commonHanziConfig.characters.slice(startIndex)
  const totalNeeded = lessonCount * charsPerLesson
  const selected = chars.slice(0, totalNeeded)

  return Array.from({ length: lessonCount }, (_, idx) => {
    const begin = idx * charsPerLesson
    const lessonChars = selected.slice(begin, begin + charsPerLesson)
    return {
      id: idx + 1,
      title: `常用字 ${idx + 1}`,
      chars: lessonChars,
    }
  }).filter((lesson) => lesson.chars.length > 0)
}

export { commonHanziConfig }
