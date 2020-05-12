import { uniq } from 'lodash'

import { Ability, DotaItem } from '../types'

export const cleanHtml = (html: string): string => {
  html = html
    .replace(/\r\n/g, '\n')
    .replace(/([\s]{2,})/g, ' ')
    .replace(/<br>/g, '\n')
    .replace(/<br \/>/g, '\n')

  html = html
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
    .replace(/<font(.*?)>(.*?)<\/font>/g, '$2')

  return html
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
}

export const abilityAffects = (data: string): string[] =>
  data
    .split('<br />')
    .map((attribute) => attribute.replace(/(<([^>]+)>)/gi, '').trim())
    .filter(Boolean)

export const abilityCooldownAndManaCost = (
  data: string
): {
  cooldown: Ability['cooldown']
  manacost: Ability['manacost']
} => {
  const [manacost, cooldown] = data
    .replace(/(<([^>]+)>)/gi, '')
    .trim()
    .split(' ')

  const cmb = {
    cooldown: cooldown
      ? uniq(cooldown.split('/').map((cooldown) => Number(cooldown)))
      : [],
    manacost: manacost
      ? uniq(manacost.split('/').map((manacost) => Number(manacost)))
      : []
  }

  return {
    cooldown:
      cmb.cooldown.length === 1 && cmb.cooldown[0] === 0 ? [] : cmb.cooldown,
    manacost:
      cmb.manacost.length === 1 && cmb.manacost[0] === 0 ? [] : cmb.manacost
  }
}

export const itemAttributes = (data: string): string[] =>
  data
    .split('<br />')
    .map((attribute) => {
      attribute = attribute.replace(/(<([^>]+)>)/gi, '').trim()

      if (['+', '-'].includes(attribute[0]) && attribute[1] !== ' ') {
        return `${attribute[0]} ${attribute.slice(1).trim()}`
      }

      return attribute
    })
    .filter(Boolean)

export const itemComponents = (data: DotaItem['components']): string[] =>
  data
    ? data.map((component) => (component === false ? 'recipe' : component))
    : []

export const itemManaCost = (data: DotaItem['mc']): number[] =>
  data === false || data === '0 0 0 0'
    ? [0]
    : typeof data === 'number'
    ? [data]
    : uniq(data.split(' ').map((data) => Number(data)))

export const attribute = (data: string): string =>
  data === 'agi' ? 'agility' : data === 'str' ? 'strength' : 'intelligence'
