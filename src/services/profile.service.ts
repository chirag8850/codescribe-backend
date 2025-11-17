import authService from './auth.service';

class ProfileService {
    async getProfile(user: any): Promise<any> {

        const user_data = await authService.getUser({ email: user.email });

        return user_data;
    }
}

export default new ProfileService();