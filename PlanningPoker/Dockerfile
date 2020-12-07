FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS api-build
WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o poker

FROM node:latest AS client-build
WORKDIR /app
COPY ./client ./
RUN yarn 
RUN yarn build


FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=api-build /app/poker .
COPY --from=client-build /app/build ./client/build
ENTRYPOINT ["dotnet", "PlanningPoker.dll"]