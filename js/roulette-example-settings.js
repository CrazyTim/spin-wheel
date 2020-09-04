import * as util from './roulette-util.js'

export default [

  {
    id: 0,
    label: 'Workout',
    radius: .84,
    itemLabelRadius: .93,
    itemLabelMaxRadius: .35,
    itemLabelRotation: 180,
    itemLabelAlign: util.AlignTextEnum.left,
    itemLabelColor: '#fff',
    itemLabelLineHeight: -1.8,
    itemLabelFont: 'Amatic SC',
    itemLabelFontMaxSize: 55,
    itemLineWidth: 1,
    itemLineColor: '#fff',
    itemColorSet: ['#ffc93c', '#66bfbf', '#a2d5f2', '#515070', '#43658b', '#ed6663', '#d54062' ],
    image: './img/example-image-0.svg',
    imageOverlay: './img/example-overlay-0.svg',
    items: [
      {
        label: 'TWISTS',
      },
      {
        label: 'PRESS UPS',
      },
      {
        label: 'JOGGING',
      },
      {
        label: 'SQUATS',
      },
      {
        label: 'PLANKS',
      },
      {
        label: 'LUNGES',
      },
      {
        label: 'BURPIES',
      },
      {
        label: 'CRUNCHES',
      },
      {
        label: 'MOUNT. CLIMB',
      },
      {
        label: 'STAR JUMPS',
      },
      {
        label: 'KANGAROOS',
      },
      {
        label: 'ROPE CLIMB',
      },
      {
        label: 'KICK BOXING',
      },
      {
        label: 'WALL SIT',
      },
    ]

  },

  {
    id: 1,
    label: 'Takeaway',
    radius: .89,
    pointerRotation: 90,
    itemLabelRadius: .92,
    itemLabelMaxRadius: .37,
    itemLabelRotation: 0,
    itemLabelAlign: util.AlignTextEnum.right,
    itemLabelColor: '#000',
    itemLabelLineHeight: 0.42,
    itemLabelFont: 'Rubik',
    itemLineWidth: 0,
    itemColorSet: ['#fbf8c4', '#e4f1aa', '#c0d26e', '#ff7d7d'],
    imageOverlay: './img/example-overlay-1.svg',
    items: [
      {
        label: 'Japanese',
      },
      {
        label: 'Fish N Chips',
      },
      {
        label: 'Sandwich',
      },
      {
        label: 'Sub Sandwich',
        weight: 1.3,
      },
      {
        label: 'Tacos / Mexican',
      },
      {
        label: 'Noodle Box',
      },
      {
        label: 'BBQ Chicken',
      },
      {
        label: 'Fried Chicken',
        weight: 1.3,
      },
      {
        label: 'Indian',
      },
      {
        label: 'Thai',
      },
      {
        label: 'Juice Smoothie',
      },
      {
        label: 'Burgers',
        weight: 1.3,
      },
      {
        label: 'Souvlaki / Kebab',
      },
      {
        label: 'Italian',
      },
      {
        label: 'Sushi',
      },
      {
        label: 'Subways',
        weight: 1.3,
      },
      {
        label: 'Pie / Bakery',
      },
      {
        label: 'Chinese',
      },
      {
        label: 'Korean',
      },
      {
        label: 'Pizza',
        weight: 1.3,
      },
    ]
  },

  {
    id: 2,
    label: 'Movies',
    radius: .88,
    itemLabelRadius: .92,
    itemLabelMaxRadius: .4,
    itemLabelRotation: 0,
    itemLabelAlign: util.AlignTextEnum.right,
    itemLabelLineHeight: 1.5,
    itemLabelFont: 'Pragati Narrow',
    itemLineWidth: 0,
    itemColorSet: ['#c7160c', '#fff'],
    itemLabelColorSet: ['#fff', '#000'],
    imageOverlay: './img/example-overlay-2.svg',
    items: [
      {
        label: 'Action',
      },
      {
        label: 'Horror',
      },
      {
        label: 'Science Fict.',
      },
      {
        label: 'Comedy',
      },
      {
        label: 'Romance',
      },
      {
        label: 'Thriller',
      },
      {
        label: 'Western',
      },
      {
        label: 'Indie',
      },
      {
        label: 'Crime',
      },
      {
        label: 'Documentary',
      },
      {
        label: 'Drama',
      },
      {
        label: 'Musical',
      },
      {
        label: 'Mystery',
      },
      {
        label: 'War',
      },
      {
        label: 'Sports',
      },
      {
        label: 'Fantasy',
      },
    ]
  },

  {
    id: 3,
    label: 'Money',
    radius: .88,
    itemLabelRadius: .93,
    itemLabelRotation: 180,
    itemLabelAlign: util.AlignTextEnum.left,
    itemLabelColor: '#000',
    itemLabelLineHeight: -0.6,
    itemLabelFont: 'Arial',
    itemLabelFontMaxSize: 22,
    itemLineWidth: 1,
    itemLineColor: '#000',
    imageOverlay: './img/example-overlay-3.svg',
    items: [
      {
        label: '$ 50',
      },
      {
        label: '$ 200',
      },
      {
        label: '$ 1000',
        weight: .6,
        color: '#f23925',
        labelColor: '#fff',
      },
      {
        label: '$ 100',
      },
      {
        label: '$ 200',
      },
      {
        label: '$ 500',
        weight: .8,
        color: '#b1ddff',
      },
      {
        label: '$ 100',
      },
      {
        label: '$ 50',
      },
      {
        label: '$ 5000',
        weight: .4,
        color: '#000',
        labelColor: '#fff',
      },
      {
        label: '$ 50',
      },
      {
        label: '$ 200',
      },
      {
        label: '$ 500',
        weight: .8,
        color: '#b1ddff',
      },
      {
        label: '$ 100',
      },
      {
        label: '$ 200',
      },
      {
        label: '$ 1000',
        weight: .6,
        color: '#f23925',
        labelColor: '#fff',
      },
      {
        label: '$ 100',
      },
      {
        label: '$ 50',
      },
      {
        label: '$ 500',
        weight: .8,
        color: '#b1ddff',
      },
    ]
  },

]
