import * as enums from '../../src/wheel.enums.js';

export default [

  {
    name: 'Workout',
    radius: .84,
    itemLabelRadius: .93,
    itemLabelRadiusMax: .35,
    itemLabelRotation: 180,
    itemLabelAlign: enums.AlignText.left,
    itemLabelColors: ['#fff'],
    itemLabelBaselineOffset: -0.07,
    itemLabelFont: 'Amatic SC',
    itemLabelFontSizeMax: 55,
    lineWidth: 1,
    lineColor: '#fff',
    itemBackgroundColors: ['#ffc93c', '#66bfbf', '#a2d5f2', '#515070', '#43658b', '#ed6663', '#d54062' ],
    image: './img/example-image-0.svg',
    overlayImage: './img/example-overlay-0.svg',
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
    name: 'Takeaway',
    radius: .89,
    pointerRotation: 90,
    itemLabelRadius: .92,
    itemLabelRadiusMax: .37,
    itemLabelRotation: 0,
    itemLabelAlign: enums.AlignText.right,
    itemLabelColors: ['#000'],
    itemLabelBaselineOffset: -0.06,
    itemLabelFont: 'Rubik',
    lineWidth: 0,
    itemBackgroundColors: ['#fbf8c4', '#e4f1aa', '#c0d26e', '#ff7d7d'],
    overlayImage: './img/example-overlay-1.svg',
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
    name: 'Movies',
    radius: .88,
    itemLabelRadius: .92,
    itemLabelRadiusMax: .4,
    itemLabelRotation: 0,
    itemLabelAlign: enums.AlignText.right,
    itemLabelBaselineOffset: -0.13,
    itemLabelFont: 'Pragati Narrow',
    lineWidth: 0,
    itemBackgroundColors: ['#c7160c', '#fff'],
    itemLabelColors: ['#fff', '#000'],
    overlayImage: './img/example-overlay-2.svg',
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
    name: 'Money',
    radius: .88,
    itemLabelRadius: .93,
    itemLabelRotation: 180,
    itemLabelAlign: enums.AlignText.left,
    itemLabelColors: ['#000'],
    itemLabelBaselineOffset: -0.06,
    itemLabelFont: 'Arial',
    itemLabelFontSizeMax: 22,
    lineWidth: 1,
    lineColor: '#000',
    overlayImage: './img/example-overlay-3.svg',
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
        backgroundColor: '#f23925',
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
        backgroundColor: '#b1ddff',
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
        backgroundColor: '#000',
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
        backgroundColor: '#b1ddff',
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
        backgroundColor: '#f23925',
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
        backgroundColor: '#b1ddff',
      },
    ]
  },

  {
    name: 'Default',
    items: [
      {
        label: 'one',
      },
      {
        label: 'two',
      },
      {
        label: 'three',
      },
    ]

  },

]
