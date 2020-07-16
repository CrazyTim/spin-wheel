import * as util from './roulette-util.js'

export default [

  { label: 'Money',
    radius: .88,
    rotation: 0,
    itemLabelRadius: .93,
    itemLabelRotation: 90,
    itemLabelAlign: util.AlignTextEnum.left,
    itemLabelColor: '#000',
    itemLabelLineHeight: -0.6,
    itemLabelFont: 'Arial',
    itemLabelSize: 22,
    itemLineWidth: 1,
    itemLineColor: '#000',
    overlayImageUrl: '../img/default-overlay-0.svg',
    itemColorSet: ['#fff'],
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

  { label: 'Takeaway',
    radius: .89,
    rotation: 90,
    itemLabelRadius: .92,
    itemLabelRotation: 270,
    itemLabelAlign: util.AlignTextEnum.right,
    itemLabelColor: '#000',
    itemLabelLineHeight: 0.42,
    itemLabelFont: 'Rubik',
    itemLabelSize: 17,
    itemLineWidth: 0,
    overlayImageUrl: '../img/default-overlay-1.svg',
    itemColorSet: ['#fbf8c4', '#e4f1aa', '#c0d26e', '#ff7d7d'],
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

  { label: 'Movies',
    radius: .88,
    rotation: 0,
    itemLabelRadius: .90,
    itemLabelRotation: 270,
    itemLabelAlign: util.AlignTextEnum.right,
    itemLabelColor: '#000',
    itemLabelFont: 'Monaco',
    itemLabelSize: 21,
    itemLineWidth: 2,
    itemLineColor: '#fff',
    overlayImageUrl: '../img/default-overlay-2.svg',
    itemColorSet: ['#c7160c', '#fff'],
    itemLabelColorSet: ['#fff', '#000'],
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

]
