const { ALGOLIA_APP_ID, ALGOLIA_APP_KEY } = process.env

import algoliasearch from 'algoliasearch'
import axios from 'axios'
import dota from 'dotaconstants'
import { compact, trim } from 'lodash'

import { fetchImage, getHeroForAbility } from './lib'
import { Ability, Hero, Item } from './types'

const main = async (): Promise<void> => {
  const {
    data: {
      lang: { Tokens }
    }
  } = await axios.get(
    'https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/resource/dota_english.json'
  )

  const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_APP_KEY)

  const abilities: Ability[] = await Promise.all(
    Object.entries(dota.abilities).map(async ([slug, ability]) => {
      let image

      if (ability.img) {
        image = await fetchImage({
          path: `/img/abilities/${slug}.png`,
          url: `https://api.opendota.com${ability.img.split('?')[0]}`
        })
      }

      return {
        attributes: ability.attrib?.map(({ header, value }) => ({
          label: trim(header, ' :'),
          value
        })),
        behavior: Array.isArray(ability.behavior)
          ? compact(ability.behavior)
          : ability.behavior,
        cooldown: ability.cd,
        damage: ability.dmg,
        damageType: ability.dmg_type,
        description: ability.desc,
        image,
        lore: Tokens[`DOTA_Tooltip_ability_${slug}_Lore`],
        manacost: ability.mc,
        name: ability.dname,
        piercesThroughBkb: ability.bkbpierce === 'Yes',
        slug
      }
    })
  )

  const heroes: Hero[] = await Promise.all(
    Object.values(dota.heroes).map(async (hero) => {
      const slug = hero.name.slice(14)

      const image = await fetchImage({
        path: `/img/heroes/${slug}.png`,
        url: `https://api.opendota.com${hero.img.split('?')[0]}`
      })
      const icon = await fetchImage({
        path: `/img/heroes/icons/${slug}.png`,
        url: `https://api.opendota.com${hero.icon.split('?')[0]}`
      })

      const heroAbilities = Object.entries(dota.hero_abilities).find(
        ([key]) => key === hero.name
      )?.[1]

      if (!heroAbilities) {
        throw new Error('Abilities not found')
      }

      return {
        abilities: abilities.filter(({ slug }) =>
          heroAbilities.abilities
            .filter((name) => name !== 'generic_hidden')
            .includes(slug)
        ),
        attributes: {
          agi: {
            base: hero.base_agi,
            gain: hero.agi_gain
          },
          int: {
            base: hero.base_int,
            gain: hero.int_gain
          },
          primary: hero.primary_attr,
          str: {
            base: hero.base_str,
            gain: hero.str_gain
          }
        },
        hype: Tokens[`npc_dota_hero_${slug}_hype`],
        icon,
        image,
        lore: compact(dota.hero_lore[slug].split('\n')),
        name: hero.localized_name,
        roles: hero.roles,
        slug,
        stats: {
          armor: {
            base: hero.base_armor,
            magicResistance: hero.base_mr
          },
          attack: {
            max: hero.base_attack_max,
            min: hero.base_attack_min,
            projectileSpeed: hero.projectile_speed,
            range: hero.attack_range,
            rate: hero.attack_rate,
            type: hero.attack_type.toLowerCase()
          },
          health: {
            base: hero.base_health,
            regen: hero.base_health_regen
          },
          mana: {
            base: hero.base_mana,
            regen: hero.base_mana_regen
          },
          movement: {
            legs: hero.legs,
            speed: hero.move_speed,
            turnRate: hero.turn_rate
          }
        },
        talents: heroAbilities.talents.map(({ level, name }) => {
          const ability = abilities.find(({ slug }) => slug === name)

          if (!ability) {
            throw new Error('Talent not found')
          }

          return {
            level,
            name: ability.name
          }
        })
      }
    })
  )

  const items: Item[] = compact(
    await Promise.all(
      Object.entries(dota.items).map(async ([slug, item]) => {
        const image = await fetchImage({
          path: `/img/items/${slug}.png`,
          url: `https://api.opendota.com${item.img.split('?')[0]}`
        })

        if (!item.dname) {
          return null
        }

        return {
          attributes: item.attrib.map(({ footer, header, value }) => ({
            header: trim(header, ' :'),
            label: footer,
            value
          })),
          charges: item.charges,
          components: item.components,
          cooldown: item.cd,
          cost: item.cost,
          created: item.created,
          hint: item.hint,
          image,
          lore: item.lore,
          manacost: item.mc,
          name: item.dname,
          notes: item.notes,
          quality: item.qual,
          slug,
          tier: item.tier
        }
      })
    )
  )

  const abilitiesIndex = algolia.initIndex('abilities')

  await abilitiesIndex.saveObjects(
    abilities.map((ability) => ({
      ...ability,
      hero: getHeroForAbility(heroes, ability),
      objectID: ability.slug
    }))
  )

  console.log('abilities saved')

  const heroesIndex = algolia.initIndex('heroes')

  await heroesIndex.saveObjects(
    heroes.map((hero) => ({
      ...hero,
      objectID: hero.slug
    }))
  )

  console.log('heroes saved')

  const itemsIndex = algolia.initIndex('items')

  await itemsIndex.saveObjects(
    items.map((item) => ({
      ...item,
      objectID: item.slug
    }))
  )

  console.log('items saved')

  console.log('done')

  process.exit()
}

main()
