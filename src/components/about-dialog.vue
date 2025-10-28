<template>
    <v-dialog activator="parent" width="auto">
        <template v-slot:default="{ isActive }">
            <v-card max-width="400" append-icon="mdi-information-outline">
                <v-card-title> About </v-card-title>
                <v-card-subtitle> ScoreKeeper 1.0 by <a href="https://exilium.com">exilium</a> </v-card-subtitle>
                <v-card-text>
                    <span>
                        <p>
                            Keep scores for any games, privately. Nothing is sent to any server in the cloud unless you explicitly share scores with
                            someone. Also works offline (use the menu to add Score Keeper to your homescreen).
                        </p>
                        <br />

                        <p>
                            Score Keeper captures anonymous site statistics. We do not track or profile visitors and we do not serve personalized
                            advertising. We do not capture scores and names or what games you play, ever. We just collect anonymous metrics to
                            understand how visitors use our site and where our traffic comes from. We do not share this data with anyone.
                        </p>
                        <br />

                        <p>
                            We use a
                            <a href="https://docs.simpleanalytics.com/what-we-collect" target="_blank">privacy-friendly alternative</a> analytics tool
                            that does not store any personal identifiable information and does not sell ads.
                        </p>
                    </span>
                </v-card-text>
                <template v-slot:actions>
                    <v-btn class="ms-auto" text="Ok" @click="isActive.value = false"></v-btn>
                </template>
            </v-card>
        </template>
    </v-dialog>
</template>
