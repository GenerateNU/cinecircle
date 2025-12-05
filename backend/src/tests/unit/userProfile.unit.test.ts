import { mapUserProfileDbToApi, mapUserProfilePatchToUpdateData } from '../../controllers/user';

describe('User profile mapping', () => {
  it('maps DB payload to API shape including movies lists and displayName/bio', () => {
    const now = new Date();
    const api = mapUserProfileDbToApi({
      userId: 'u-1',
      username: 'user1',
      onboardingCompleted: true,
      primaryLanguage: 'English',
      secondaryLanguage: ['Spanish'],
      profilePicture: null,
      country: 'USA',
      city: 'NYC',
      favoriteGenres: ['Drama'],
      favoriteMovies: ['tt0111161'],
      displayName: 'User One',
      bio: 'Cinephile',
      moviesToWatch: ['m1', 'm2'],
      moviesCompleted: ['m3'],
      privateAccount: false,
      spoiler: false,
      createdAt: now,
      updatedAt: now,
    });

    expect(api.displayName).toBe('User One');
    expect(api.bio).toBe('Cinephile');
    expect(api.moviesToWatch).toEqual(['m1', 'm2']);
    expect(api.moviesCompleted).toEqual(['m3']);
  });

  it('builds patch only for provided fields, preserving displayName when not sent', () => {
    const data = mapUserProfilePatchToUpdateData({
      username: 'newUser',
      favoriteGenres: ['Action'],
    });

    expect(data).toHaveProperty('username', 'newUser');
    expect(data).toHaveProperty('favoriteGenres', ['Action']);
    expect(data).not.toHaveProperty('displayName');
  });

  it('sets displayName and movies lists when provided in patch', () => {
    const data = mapUserProfilePatchToUpdateData({
      displayName: 'Shown Name',
      moviesToWatch: ['a', 'b'],
      moviesCompleted: ['c'],
    });

    expect(data).toHaveProperty('displayName', 'Shown Name');
    expect(data).toHaveProperty('moviesToWatch', ['a', 'b']);
    expect(data).toHaveProperty('moviesCompleted', ['c']);
  });
});
