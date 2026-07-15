export type Gender = 'male' | 'female'

export type LearningLevel = 'kids' | 'student' | 'pro'

export type SystemId =
  | 'skeletal'
  | 'muscular'
  | 'nervous'
  | 'endocrine'
  | 'digestive'
  | 'respiratory'
  | 'circulatory'
  | 'urinary'
  | 'reproductive'
  | 'integumentary'
  | 'immune'
  | 'lymphatic'
  | 'sensory'
  | 'articular'

export interface AnatomySystem {
  id: SystemId
  name: string
  shortName: string
  color: string
  glow: string
  icon: string
  description: string
  longDescription: string
  functions: string[]
  organCount: number
  funFact: string
  commonDiseases: string[]
  care: string[]
}

export interface OrganPosition {
  x: number
  y: number
  z: number
  scale: number
}

export type OrganShape =
  | 'brain'
  | 'heart'
  | 'lungs'
  | 'kidney'
  | 'tube'
  | 'longbone'
  | 'ribcage'
  | 'spine'
  | 'gland'
  | 'eye'
  | 'node'
  | 'muscle'
  | 'skin'
  | 'joint'
  | 'blob'

export interface LevelText {
  kids: string
  student: string
  pro: string
}

export interface OrganInfo {
  id: string
  name: string
  scientificName: string
  system: SystemId
  position: OrganPosition
  shape: OrganShape
  color: string
  primaryFunction: string
  secondaryFunctions: string[]
  location: string
  size: string
  weight: string
  relatedOrgans: string[]
  curiosities: string[]
  diseases: string[]
  prevention: string[]
  recommendations: string[]
  whatIsIt: LevelText
  howItWorks: LevelText
  references: string[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  xp: number
}
