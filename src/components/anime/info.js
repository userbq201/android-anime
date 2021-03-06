import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { connect } from "react-redux";

import { getFavorite } from "../../redux/actions/getAnime";

import config from "../../config";
import ImagePreload from '../../components/image/imagesPreload';
import arraytoString from "../../helpers/arrayToString";
import replacer from "../../helpers/replacer";

class AnimebyId extends Component {

  constructor(props) { 
    super(props);
    this.state = {
      star: true
    };
  }

  componentWillMount() { 
    const { anime, favorite } = this.props;
    if (favorite.data.find(item => item.AnimeId === anime.AnimeId)) { 
      this.setState({ star: false });
    };
  }

  _addToStorage(anime) { 
    
    const { onGetFavorite } = this.props;
    const obj = {
      AnimeId: anime.AnimeId,
      ImageUrl: anime.ImageUrl,
      Title: anime.Title,
      CountSeries: anime.Series.length,
      TotalSeriesCount: anime.TotalSeriesCount,
      ViewCount: anime.ViewCount,
      Genres: anime.Genres,
      AgeLimit: anime.AgeLimit
    };

    AsyncStorage.getItem("favorite", (err, val) => { 
      if (err) throw err;
      if (val === null) { 
        AsyncStorage.setItem("favorite", JSON.stringify([obj]), () => { 
          this.setState({ star: false });
          onGetFavorite();
        });
        return;
      }
      val = JSON.parse(val);
      let data = val.find(item => {
        return item.AnimeId === obj.AnimeId;
      });
      if (!data) { 
        val.push(obj);
        AsyncStorage.setItem("favorite", JSON.stringify(val), () => { 
          this.setState({ star: false });
          onGetFavorite();
        });
        
        return;
      }
      val.splice(val.indexOf(data), 1);
      AsyncStorage.setItem("favorite", JSON.stringify(val), () => { 
        this.setState({ star: true });
        onGetFavorite();
      });
    });

  }

  _renderAnime() { 
    const { anime } = this.props;

    return (
      <ScrollView>
        <ImagePreload
          uri={`${config.animeImg}${anime.AnimeId}/${anime.ImageUrl}`}
          width={config.defaultWidth}
        />
        <View style={styles.age}> 
          <Text style={{ color: "#fff", fontWeight: "bold" }}>{anime.AgeLimit}+</Text>
        </View>

        <Icon
          name={this.state.star ? "md-add-circle" : "md-close-circle"}
          size={40}
          style={{
            color: "#f80000",
            position: "absolute",
            top: 5,
            right: 10,
            zIndex: 2
          }}
          onPress={() => { 
            this._addToStorage(anime);
          }}
        />
        
        <View style={styles.info}>
          <Text style={styles.infoTitle}>
            {anime.Title} / {anime.TitleEn}
          </Text>
          <Text style={styles.primaryText}>  
            Год: {anime.StartYear}
          </Text>
          <Text style={styles.primaryText}>  
            Серии: [{anime.Series.length ? anime.Series.length : '??'} из {anime.TotalSeriesCount ? anime.TotalSeriesCount : '??'}]
          </Text>
          <Text style={[styles.primaryText]}>  
            просмотров: {anime.ViewCount}
          </Text>
          <Text style={[styles.primaryText, {color: "#657182"}]}>  
            Тип: {anime.Type ? anime.Type : '??'}
          </Text>
          <Text style={[styles.primaryText, {color: "#657182"}]}>  
            Жанр: {arraytoString(anime.Genres, "Title")}
          </Text>
          <Text style={[styles.primaryText, {color: "#657182"}]}>  
            Даберы: {arraytoString(anime.Dubs, "Title")}
          </Text>
          <Text style={[styles.primaryText, styles.FullDescription, {fontSize: 14}]}>  
            {replacer(anime.FullDescription)}
          </Text>
        </View>
      </ScrollView>
    );
  }

  render() {
    return (
      <View>
        {this._renderAnime()}
      </View>
    );
  }
};

export default connect(
  state => ({
    favorite: state.favorite
  }),
  dispatch => ({
    onGetFavorite: () => { 
      dispatch(getFavorite())
    }
  })
)(AnimebyId);

const styles = StyleSheet.create({
  infoTitle: {
    color: "#f80000",
    fontSize: 15,
    lineHeight: 25,
    fontFamily: "Roboto-Medium"
  },
  info: {
    paddingTop: 15,
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 15,
    marginBottom: 15
  },
  primaryText: {
    color: "#2e2e2e",
    fontSize: 15,
    lineHeight: 25,
    fontFamily: "Roboto-Thin",
    fontWeight: "bold"
  },
  age: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#f80000",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  preload: {
    color: "#2e2e2e",
    fontSize: 15,
    lineHeight: 25
  },
  FullDescription: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 22,
    fontFamily: "Roboto-Thin",
    flex:1
  }
});