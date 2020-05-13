import axios from 'axios'
import {
  createWriteStream,
  ensureFile,
  pathExists,
  ReadStream,
  unlink
} from 'fs-extra'
import { resolve } from 'path'

import { Ability, Hero, Image } from '../types'

export const fetchImage = async (image: Image): Promise<string | undefined> => {
  const path = resolve(__dirname, '../..', 'assets', image.path.slice(5))

  if (await pathExists(path)) {
    return image.path
  }

  await ensureFile(path)

  const stream = createWriteStream(path)

  try {
    const response = await axios.get<ReadStream>(
      image.url.replace('_md', '_lg'),
      {
        responseType: 'stream'
      }
    )

    response.data.pipe(stream)

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(image.path))
      stream.on('error', async () => {
        await unlink(path)

        reject()
      })
    })
  } catch (error) {
    await unlink(path)
  }
}

export const getHeroForAbility = (
  heroes: Hero[],
  ability: Ability
): string | undefined => {
  const hero = heroes.find(({ abilities }) =>
    abilities.find(({ slug }) => slug === ability.slug)
  )

  return hero?.slug
}
