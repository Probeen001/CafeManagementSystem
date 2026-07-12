const MENU_IMAGE_URLS = {
  brownie: 'https://loremflickr.com/800/600/brownie?lock=101',
  'chocolate-lava': 'https://loremflickr.com/800/600/chocolate,cake?lock=103',
  tiramisu: 'https://loremflickr.com/800/600/tiramisu,dessert?lock=104',
  waffle: 'https://loremflickr.com/800/600/waffle,dessert?lock=105',
  'caesar-salad': 'https://loremflickr.com/800/600/caesar,salad?lock=106',
  'chicken-burger': 'https://loremflickr.com/800/600/chicken,burger?lock=107',
  'club-sandwich': 'https://loremflickr.com/800/600/club,sandwich?lock=108',
  'paneer-wrap': 'https://loremflickr.com/800/600/paneer,wrap?lock=109',
  'pasta-arrabbiata': 'https://loremflickr.com/800/600/pasta,arrabbiata?lock=110',
  'veggie-burger': 'https://loremflickr.com/800/600/vegetarian,burger?lock=111',
  'chicken-wings': 'https://loremflickr.com/800/600/chicken,wings?lock=112',
  'garlic-bread': 'https://loremflickr.com/800/600/garlic,bread?lock=113',
  'masala-fries': 'https://loremflickr.com/800/600/french,fries?lock=114',
  nachos: 'https://loremflickr.com/800/600/nachos?lock=115',
  'spring-roll': 'https://loremflickr.com/800/600/spring,roll?lock=116',
}

const DRINK_IMAGE_URLS = {
  'cold-coffee': '/images/menu/iced-drink.svg',
  'iced-latte': '/images/menu/iced-drink.svg',
  'cold-brew': '/images/menu/iced-drink.svg',
  frappuccino: '/images/menu/iced-drink.svg',
  'iced-lemon-tea': '/images/menu/tea.svg',
  lemonade: '/images/menu/tea.svg',
  'masala-chai': '/images/menu/tea.svg',
  'butter-tea': '/images/menu/tea.svg',
  'mango-smoothie': '/images/menu/smoothie.svg',
}

function menuImageKey(name) {
  const normalized = String(name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
  if (normalized === 'chocolate-lava-cake') return 'chocolate-lava'
  if (normalized === 'pasta-arrabiata') return 'pasta-arrabbiata'
  if (normalized === 'spring-rolls') return 'spring-roll'
  return normalized
}

export function getMenuImage(item) {
  const image = String(item?.image_url || item?.imageUrl || '').trim()
  if (image) return image

  const imageKey = menuImageKey(item?.name)
  const drinkImage = DRINK_IMAGE_URLS[imageKey]
  if (drinkImage) return drinkImage

  const matchedImage = MENU_IMAGE_URLS[imageKey]
  if (matchedImage) return matchedImage

  const key = String(item?.category_name || item?.category || item?.name || '').toLowerCase()
  if (/coffee|latte|cappuccino|tea|drink|juice|smoothie/.test(key)) return '/images/menu/coffee.svg'
  if (/dessert|cake|brownie|waffle|tiramisu/.test(key)) return '/images/menu/dessert.svg'
  if (/snack|fries|roll|nachos/.test(key)) return '/images/menu/snack.svg'
  if (/momo|dumpling/.test(key)) return '/images/menu/chicken-momo.svg'
  if (/chow|min|noodle|pasta/.test(key)) return '/images/menu/chowmin.svg'
  return '/images/menu/default.svg'
}
