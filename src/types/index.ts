export type Image = {
  path: string
  url: string
}

export type Ability = {
  attributes?: {
    label: string
    value: string | string[]
  }[]
  behavior?: string | string[]
  cooldown?: string | string[]
  damage?: string
  damageType?: string
  description?: string
  image?: string
  lore?: string
  manacost?: string | string[]
  name: string
  piercesThroughBkb?: boolean
  slug: string
}

export type Hero = {
  abilities: Ability[]
  attributes: {
    agi: {
      base: number
      gain: number
    }
    int: {
      base: number
      gain: number
    }
    primary: string
    str: {
      base: number
      gain: number
    }
  }
  icon?: string
  image?: string
  lore: string[]
  name: string
  roles: string[]
  slug: string
  stats: {
    armor: {
      base: number
      magicResistance: number
    }
    attack: {
      max: number
      min: number
      projectileSpeed: number
      range: number
      rate: number
      type: string
    }
    health: {
      base: number
      regen: number
    }
    mana: {
      base: number
      regen: number
    }
    movement: {
      legs: number
      speed: number
      turnRate: number
    }
  }
  talents: {
    name: string
    level: number
  }[]
}

export type Item = {
  attributes: {
    header: string
    label: string
    value: string | string[]
  }[]
  charges: number | false
  components: null | string[]
  cooldown: number | false
  cost: number
  created: boolean
  hint?: string[]
  image?: string
  lore: string
  manacost: number | false
  name: string
  notes: string
  quality?: string
  slug: string
}
