const { ALGOLIA_APP_ID, ALGOLIA_APP_KEY } = process.env

import algoliasearch from 'algoliasearch'
import axios from 'axios'

import {
  abilityAffects,
  abilityCooldownAndManaCost,
  attribute,
  cleanHtml,
  itemAttributes,
  itemComponents,
  itemManaCost
} from './lib'
import { Ability, DotaAbility, DotaHero, DotaItem, Hero, Item } from './types'

const main = async (): Promise<void> => {
  const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_APP_KEY)

  const {
    data: {
      lang: { Tokens }
    }
  } = await axios.get(
    'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/dota_english.json'
  )

  const {
    data: { abilitydata, herodata, itemdata }
  } = await axios.get<{
    abilitydata: Record<string, DotaAbility>
    itemdata: Record<string, DotaItem>
    herodata: Record<string, DotaHero>
  }>(
    'https://www.dota2.com/jsfeed/heropediadata?feeds=itemdata,abilitydata,herodata'
  )

  const items: Item[] = Object.entries(itemdata).map(
    ([
      slug,
      {
        attrib,
        cd,
        components,
        cost,
        created,
        desc,
        dname,
        img,
        lore,
        mc,
        notes,
        qual
      }
    ]) => ({
      attributes: itemAttributes(attrib),
      components: itemComponents(components),
      cooldown: cd,
      cost,
      crafted: created,
      description: cleanHtml(desc),
      image: img.split('?')[0],
      lore: cleanHtml(lore),
      manacost: itemManaCost(mc),
      name: cleanHtml(dname),
      notes: cleanHtml(notes),
      quality: qual || null,
      slug
    })
  )

  const itemsIndex = algolia.initIndex('items')

  await itemsIndex.saveObjects(
    items.map((item) => ({
      ...item,
      objectID: item.slug
    }))
  )

  console.log('items saved')

  const heroes: Hero[] = Object.entries(herodata).map(
    ([slug, { attribs, dac, dname, droles, pa }]) => ({
      abilities: [],
      attack: dac.toLowerCase(),
      attributes: {
        agility: {
          base: attribs.agi.b,
          gain: Number(attribs.agi.g)
        },
        armor: attribs.armor,
        damage: {
          max: attribs.dmg.max,
          min: attribs.dmg.min
        },
        intelligence: {
          base: attribs.int.b,
          gain: Number(attribs.int.g)
        },
        primary: attribute(pa),
        speed: attribs.ms,
        strength: {
          base: attribs.str.b,
          gain: Number(attribs.str.g)
        }
      },
      hype: Tokens[`npc_dota_hero_${slug}_hype`],
      image: `${slug}_full.png`,
      lore: Tokens[`npc_dota_hero_${slug}_bio`],
      name: dname,
      portrait: `${slug}_vert.jpg`,
      roles: droles.split(' - '),
      slug
    })
  )

  const abilities: Ability[] = Object.entries(abilitydata).map(
    ([
      slug,
      { affects, attrib, cmb, desc, dmg, dname, hurl, lore, notes }
    ]) => ({
      ...abilityCooldownAndManaCost(cmb),
      affects: abilityAffects(affects),
      attributes: abilityAffects(attrib),
      damage: abilityAffects(dmg),
      description: cleanHtml(desc),
      hero: hurl,
      image: slug.indexOf('special') === 0 ? null : `${slug}_hp1.png`,
      lore: cleanHtml(lore),
      name: dname,
      notes: cleanHtml(notes),
      slug
    })
  )

  heroes.forEach((hero) => {
    hero.abilities = abilities
      .filter((ability) => ability.slug.indexOf(hero.slug) === 0)
      .map((ability) => ability.slug)
  })

  const heroesIndex = algolia.initIndex('heroes')

  await heroesIndex.saveObjects(
    heroes.map((hero) => ({
      ...hero,
      objectID: hero.slug
    }))
  )

  console.log('heroes saved')

  const abilitiesIndex = algolia.initIndex('abilities')

  await abilitiesIndex.saveObjects(
    abilities.map((ability) => ({
      ...ability,
      objectID: ability.slug
    }))
  )

  console.log('abilities saved')

  console.log('done')

  process.exit()
}

main()
