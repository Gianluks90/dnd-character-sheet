export class AdventurerUser {
    id: string = '';
    displayName: string = '';
    photoURL: string = '';
    role: string = Role.USER;

    characters: string[] = [];
    progressive: number = 0;
    charactersLimit: number = 3;
    favoriteCharacter: string = ''

    campaignProgressive: number = 0;
    createdCampaigns: string[] = [];
    campaignAsPartecipant: string[] = [];
    favoriteCampaign: string = '';

    adventuresProgressive: number = 0;
    createdAdventures: string[] = [];

    // dddiceToken: string = '';
    // privateSlug: string = '';
    // rollTheme: string = '';

    constructor() {}

    static parseUser(userId: string, data: any): AdventurerUser {
        const result = new AdventurerUser();
        result.id = userId;
        result.displayName = data.displayName;
        result.role = data.role === 'admin' ? Role.ADMIN : Role.USER;
        result.characters = data.characters || [];
        result.progressive = data.progressive || 0;
        result.charactersLimit = data.charactersLimit || 3;
        result.favoriteCharacter = data.favoriteCharacter || '';
        result.campaignProgressive = data.campaignProgressive || 0;
        result.createdCampaigns = data.createdCampaigns || [];
        result.campaignAsPartecipant = data.campaignAsPartecipant || [];
        result.favoriteCampaign = data.favoriteCampaign || '';
        result.adventuresProgressive = data.adventuresProgressive || 0;
        // result.dddiceToken = data.dddiceToken || '';
        // result.privateSlug = data.privateSlug || '';
        // result.rollTheme = data.rollTheme || '';
        return result;
    }
}

export enum Role {
    ADMIN = 'admin',
    USER = 'user'
}