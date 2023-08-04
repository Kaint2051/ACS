# Use the base Ubuntu 22.04 image
FROM ubuntu:20.04

# Set up environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    tmux \
    vim \
    gnupg2 \
    gnupg

# Install Node.js and npm
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Install yarn
RUN npm install -g yarn

# Copy the source code to the container
COPY . /genieacs-customization
WORKDIR /genieacs-customization

# Install dependencies and build the app
RUN yarn install
RUN yarn run build

# Set up GenieACS start script
WORKDIR /genieacs-customization/dist/bin
RUN touch genieacs-start.sh \
    && chmod 777 genieacs-start.sh \
    && echo '#!/bin/sh' >> ./genieacs-start.sh \
    && echo 'tmux new-session -s "genieacs" -d' >> ./genieacs-start.sh \
    && echo 'tmux send-keys "./genieacs-cwmp" "C-m"' >> ./genieacs-start.sh \
    && echo 'tmux split-window' >> ./genieacs-start.sh \
    && echo 'tmux send-keys "./genieacs-nbi" "C-m"' >> ./genieacs-start.sh \
    && echo 'tmux split-window' >> ./genieacs-start.sh \
    && echo 'tmux send-keys "./genieacs-fs" "C-m"' >> ./genieacs-start.sh \
    && echo 'tmux split-window' >> ./genieacs-start.sh \
    && echo 'tmux send-keys "./genieacs-ui --ui-jwt-secret changeme" "C-m"' >> ./genieacs-start.sh \
    && echo 'tmux select-layout tiled 2>/dev/null' >> ./genieacs-start.sh \
    && echo 'tmux rename-window "GenieACS"' >> ./genieacs-start.sh \
    && echo 'echo "GenieACS has been started in tmux session 'geneiacs'"' >> ./genieacs-start.sh \
    && echo 'echo "To attach to session, use: tmux attach -t genieacs"' >> ./genieacs-start.sh \
    && echo 'echo "To switch between panes use Ctrl+B-ArrowKey"' >> ./genieacs-start.sh \
    && echo 'echo "To deattach, press Ctrl+B-D"' >> ./genieacs-start.sh \
    && echo 'echo "To stop GenieACS, use: ./genieacs-stop.sh"' >> ./genieacs-start.sh

# Install Angular CLI and dependencies for the admin app
WORKDIR /genieacs-customization/genie-acs-admin-app
RUN yarn global add @angular/cli@14.0.6
RUN yarn install

# Install schedule
WORKDIR /genieacs-customization/schedule
RUN npm install
# Expose necessary ports
EXPOSE 7547 7548 3000 4200

# Start GenieACS and the admin app when the container is run
CMD ["/bin/bash", "-c", "cd /genieacs-customization/dist/bin && ./genieacs-start.sh & cd /genieacs-customization/schedule && npm start & cd /genieacs-customization/genie-acs-admin-app && yarn start"]

