import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';

import { connect } from "react-redux";

import { getFavorite } from "../../redux/actions/getAnime";

import Card from "../../components/anime/card";
import ToUp from "../../components/toUp";

class Favorite extends Component {

  constructor(props) { 
    super(props);
    this.state = {
      y: 0
    };
  }

  componentWillMount() { 
    this.props.onGetFavorite();
  }

  _hundleRefresh() { 
    this.props.onGetFavorite();
  }

  render() {
    const { favorite, navigation } = this.props;
    let _scrollView = undefined;

    return (
      <View style={styles.container}>
        <ToUp
          toUp={() => _scrollView.scrollToOffset({ offset: 0, animated: true })}
          scrollY={this.state.y}
        />
        <FlatList
          data={favorite.data}
          renderItem={({ item }) => <Card item={item} touch={(id, title) => navigation.navigate("AnimeById", { id, title }) }/>}
          keyExtractor={(item) => item.AnimeId}
          refreshControl={
            <RefreshControl
              refreshing={favorite.isLoading}
              onRefresh={this._hundleRefresh.bind(this)}
              colors={["red", "green", "black"]}
              progressBackgroundColor="#fff"
            />
          }
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

export default connect(
  state => ({
    favorite: state.favorite
  }),
  dispatch => ({
    onGetFavorite: () => { 
      dispatch(getFavorite())
    }
  })
)(Favorite);