export const {MONGODB_USERNAME,MONGODB_PASSWORD}=process.env

console.log(MONGODB_USERNAME);
console.log(MONGODB_PASSWORD);

export const connectionSRT="mongodb+srv://"+MONGODB_USERNAME+":"+MONGODB_PASSWORD+"@cluster0.ajkzguy.mongodb.net/imgdatabase?retryWrites=true&w=majority&appName=Cluster0"

