export const env = {
  template: (name: string, props: any): string => {
    const { projectName } = props;
    return `
# MongoDB Bağlantısı
MONGODB_URI=mongodb://localhost:27017/${projectName}

# JWT Ayarları
JWT_SECRET=f7d82ca3e9b2c4a5d1e8f6b0a3c9d7e5
JWT_EXPIRES_IN=1d
    `;
  },
};
