import React, { Component } from 'react';
import {
  View,
  Image,
} from 'react-native';

const contentTypeMap = [
  {
    key: 'link',
    image: require('./Link.png')
  },
  {
    key: 'podcast',
    image: require('./Podcast.png')
  },
  {
    key: 'television',
    image: require('./Television.png')
  },
]

loadImage = (type) => {
  const link = contentTypeMap.filter((item) => item['key'] === type)

  return link.length > 0 ? link[0].image : null //return default
}

export default class ContentIcon extends Component {
  render() {
    const {type} = this.props
    const image = loadImage(type)

    return (
      <View>
        <Image source={image}/>
      </View>
    )
  }
}
