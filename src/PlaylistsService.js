const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const queryPlaylist = {
      text: `
      SELECT p.id, p.name
      FROM playlist_songs AS ps
      JOIN playlists AS p ON p.id = ps.playlist_id
      WHERE p.id = $1
      `,
      values: [playlistId],
    };

    const querySongs = {
      text: `
        SELECT s.id, s.title, s.performer
        FROM playlist_songs AS ps
        JOIN songs AS s ON s.id = ps.song_id
        WHERE ps.playlist_id = $1;
      `,
      values: [playlistId],
    };

    const playlist = await this._pool.query(queryPlaylist);
    const songs = await this._pool.query(querySongs);

    return {
      playlist: {
        ...playlist.rows[0],
        songs: songs.rows,
      }
    };
  }
}

module.exports = PlaylistsService;
