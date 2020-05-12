// dota

export type DotaAbility = {
  affects: string
  attrib: string
  cmb: string
  desc: string
  dmg: string
  dname: string
  hurl: string
  lore: string
  notes: string
}

export type DotaHero = {
  attribs: {
    agi: {
      b: number
      g: string
    }
    armor: number
    dmg: {
      min: number
      max: number
    }
    int: {
      b: number
      g: string
    }
    ms: number
    str: {
      b: number
      g: string
    }
  }
  dac: string
  dname: string
  droles: string
  pa: string
  u: string
}

export type DotaItem = {
  attrib: string
  cd: number
  components: (string | false)[]
  cost: number
  created: boolean
  desc: string
  dname: string
  id: number
  img: string
  lore: string
  mc: string | number | false
  notes: string
  qual: string | false
}

// db

export type Ability = {
  affects: string[]
  attributes: string[]
  cooldown: number[]
  damage: string[]
  description: string
  hero: string
  image: string | null
  lore: string
  manacost: number[]
  name: string
  notes: string
  slug: string
}

export type Hero = {
  abilities: string[]
  attack: string
  attributes: HeroAttributes
  hype: string
  image: string
  lore: string
  name: string
  portrait: string
  roles: string[]
  slug: string
}

export type HeroAttributes = {
  agility: HeroAttribute
  armor: number
  damage: HeroDamage
  intelligence: HeroAttribute
  primary: string
  speed: number
  strength: HeroAttribute
}

export type HeroAttribute = {
  base: number
  gain: number
}

export type HeroDamage = {
  max: number
  min: number
}

export type Item = {
  attributes: string[]
  components: string[]
  cooldown: number
  cost: number
  crafted: boolean
  description: string
  image: string
  lore: string
  manacost: number[]
  name: string
  notes: string
  quality: string | null
  slug: string
}
