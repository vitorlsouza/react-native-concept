import React, { useState, useEffect } from "react";
import api from './services/api'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const [ repositories, setRepositories] = useState([])

  useEffect(() => {
    api.get('repositories')
      .then(response => setRepositories(response.data))
  },[])

  async function handleLikeRepository(id) {
    const { data: repository } = await api.post(`repositories/${id}/like`)
    const repositoryIndex = repositories.findIndex(repository => repository.id === id)
    repositories[repositoryIndex] = repository
    setRepositories([...repositories])
  }

  renderLikes = (likes) => (
    likes <= 1 ? `${likes} curtida` : `${likes} curtidas`
  )

  renderItem = ({id, title, techs, likes}) => {
    return (
      <View style={styles.repositoryContainer}>
        <Text style={styles.repository}>{title}</Text>
        <View style={styles.techsContainer}>
          {techs && techs.map(tech => (
            <Text style={styles.tech} key={tech}>
              {tech}
            </Text>
          ))}
        </View>
        <View style={styles.likesContainer}>
          <Text
            style={styles.likeText}
            testID={`repository-likes-${id}`}
          >
            {this.renderLikes(likes)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLikeRepository(id)}
          testID={`like-button-${id}`}
        >
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={repositories}
          keyExtractor={item => item.id}
          renderItem={({ item }) => renderItem(item)}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
