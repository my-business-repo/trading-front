FROM node:22-alpine
WORKDIR /app
COPY build /app/build
RUN npm install -g serve

CMD ["serve", "-s", "build"]
EXPOSE 3000