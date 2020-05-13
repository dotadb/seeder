declare module 'dotaconstants' {
  export const abilities: Record<string, Ability>
  export const heroes: Record<string, Hero>
  export const hero_abilities: Record<string, HeroAbilities>
  export const items: Record<string, Item>
}

type Ability = {
  dname: string
  behavior?: string | string[]
  dmg_type?: string
  bkbpierce?: string
  desc?: string
  dmg?: string
  attrib?: {
    header: string
    value: string | string[]
  }[]
  mc?: string | string[]
  cd?: string | string[]
  img?: string
}

type Hero = {
  id: number
  name: string
  localized_name: string
  primary_attr: string
  attack_type: string
  roles: string[]
  img: string
  icon: string
  base_health: number
  base_health_regen: number
  base_mana: number
  base_mana_regen: number
  base_armor: number
  base_mr: number
  base_attack_min: number
  base_attack_max: number
  base_str: number
  base_agi: number
  base_int: number
  str_gain: number
  agi_gain: number
  int_gain: number
  attack_range: number
  projectile_speed: number
  attack_rate: number
  move_speed: number
  turn_rate: number
  cm_enabled: boolean
  legs: number
}

type HeroAbilities = {
  abilities: string[]
  talents: {
    name: string
    level: number
  }[]
}

type Item = {
  hint?: string[]
  id: number
  img: string
  dname?: string
  qual?: string
  cost: number
  notes: string
  attrib: {
    header: string
    value: string | string[]
    footer: string
  }[]
  mc: number | false
  cd: number | false
  lore: string
  components: null | string[]
  created: boolean
  charges: number | false
}
