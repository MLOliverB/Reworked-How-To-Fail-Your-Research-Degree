import { GameData } from "../../GameData";
import { GameActivityCard, Connectivity } from "../types";


/**
 * Checks if the card currently held on the Activity Card Stack can be placed down on the board of the given team legally.
 * This is done by collecting all free positions where a card could be placed and then checking the adjacent cards for each position if the current card fits.
 * This is repeated until a matching position is found or until all free positions have been exhausted.
 * @param gameData The global Game Data instance.
 * @param team The number of the team whose gameboard will be checked.
 * @returns True if the current card cannot be played and therefore can be discarded, False otherwise.
 */
export function isDiscardable(gameData: GameData, team: number): boolean {
    // All cards in PLAN stage are always playable - so not discardable
    // If no card is currently held, can't discard by default
    if (gameData.stage == 1 || gameData.teams[team].currentCard == 0) {
        return false;
    }

    let currentRow = gameData.teams[team].cards[gameData.stage-1];
    let previousRow = gameData.teams[team].cards[gameData.stage-2];

    // Put all indexes of empty card boxes into an array freePositions
    let freePositions: number[] = [];
    currentRow.getIndexes().forEach((val) => {
        if (currentRow.get(val).getCardID() == 0) {
            freePositions.push(val);
        }
    });

    let currentCardID = gameData.teams[team].currentCard;
    let currentCard: GameActivityCard = gameData.activityCardMap.get(currentCardID);
    let currentCardConnectivity = currentCard.connectivity;

    let defaultConnectivity: Connectivity = {left: true, right: true, up: true, down: true};

    while (freePositions.length > 0) {
        let ix = freePositions.pop();
        if (ix == undefined) {
            ix = 0;
        }
        
        let leftCardID = (currentRow.leftIndex() <= ix-1) ? currentRow.get(ix-1).getCardID() : 0;
        let rightCardID = (currentRow.rightIndex() >= ix+1) ? currentRow.get(ix+1).getCardID() : 0;
        let bottomCardID = (previousRow.leftIndex() <= ix && previousRow.rightIndex() >= ix) ? previousRow.get(ix).getCardID() : 0;

        let leftCard: GameActivityCard | null = gameData.activityCardMap.has(leftCardID) ? gameData.activityCardMap.get(leftCardID) : null;
        let rightCard: GameActivityCard | null = gameData.activityCardMap.has(rightCardID) ? gameData.activityCardMap.get(rightCardID) : null;
        let bottomCard: GameActivityCard | null = gameData.activityCardMap.has(bottomCardID) ? gameData.activityCardMap.get(bottomCardID) : null;

        let leftCardConnectivity = (leftCard == null) ? defaultConnectivity : leftCard.connectivity;
        let rightCardConnectivity = (rightCard == null) ? defaultConnectivity : rightCard.connectivity;
        let bottomCardConnectivity = (bottomCard == null) ? defaultConnectivity : bottomCard.connectivity;

        // Check if an work-late tile is overlaid - if so then the card is automatically connected to all sides
        leftCardConnectivity = (leftCard != null && currentRow.get(ix-1).hasWorkLate()) ? defaultConnectivity : leftCardConnectivity;
        rightCardConnectivity = (rightCard != null && currentRow.get(ix+1).hasWorkLate()) ? defaultConnectivity : rightCardConnectivity;
        bottomCardConnectivity = (bottomCard != null && previousRow.get(ix).hasWorkLate()) ? defaultConnectivity : bottomCardConnectivity;


        // For each direction (left, right, bottom), check if the connections of the cards line up
        let leftAligned = (leftCard == null) ? true : (leftCardConnectivity.right == currentCardConnectivity.left);
        let rightAligned = (rightCard == null) ? true : (rightCardConnectivity.left == currentCardConnectivity.right);
        let bottomAligned = (bottomCard == null) ? true : (bottomCardConnectivity.up == currentCardConnectivity.down);

        // For each direction (left, right, bottom), check if the card is actually connected in that direction
        let leftConnected = (leftCard == null) ? false : (leftCardConnectivity.right && currentCardConnectivity.left);
        let rightConnected = (rightCard == null) ? false : (rightCardConnectivity.left && currentCardConnectivity.right);
        let bottomConnected = (bottomCard == null) ? false : (bottomCardConnectivity.up && currentCardConnectivity.down);

        console.group(`Position (${gameData.stage}, ${ix})`);
        console.log(`| ${(leftCardConnectivity.up ? '^' : 'x')}   ${(currentCardConnectivity.up ? '^' : 'x')}   ${(rightCardConnectivity.up ? '^' : 'x')} |${(leftCard != null && currentRow.get(ix-1).hasWorkLate) ? ' Left Card Work Late' : (leftCard != null) ? ' Left Card Normal' : ' No Left Card'}\n|${(leftCardConnectivity.left ? '<' : 'x')}L${(leftCardConnectivity.right ? '>' : 'x')} ${(currentCardConnectivity.left ? '<' : 'x')}C${(currentCardConnectivity.right ? '>' : 'x')} ${(rightCardConnectivity.left ? '<' : 'x')}R${(rightCardConnectivity.right ? '>' : 'x')}|${(rightCard != null && currentRow.get(ix+1).hasWorkLate) ? ' Right Card Work Late' : (rightCard != null) ? ' Right Card Normal' : ' No Right Card'}\n| ${(leftCardConnectivity.down ? 'v' : 'x')}   ${(currentCardConnectivity.down ? 'v' : 'x')}   ${(rightCardConnectivity.down ? 'v' : 'x')} |${(bottomCard != null && previousRow.get(ix).hasWorkLate) ? ' Bottom Card Work Late' : (bottomCard != null) ? ' Bottom Card Normal' : ' No Bottom Card'}\n|     ${(bottomCardConnectivity.up ? '^' : 'x')}     |\n|    ${(bottomCardConnectivity.left ? '<' : 'x')}B${(bottomCardConnectivity.right ? '>' : 'x')}    |\n|     ${(bottomCardConnectivity.down ? 'v' : 'x')}     |`);
        console.log(`Alignment - Left ${leftAligned}, Right ${rightAligned}, Bottom ${bottomAligned}`);
        console.log(`Connectivity - Left ${leftConnected}, Right ${rightConnected}, Bottom ${bottomConnected}`);
        console.groupEnd();


        // If the card is placable in the current position, the user is not allowed to discard it
        // Else we check the next placement
        if (leftAligned && rightAligned && bottomAligned && (leftConnected || rightConnected || bottomConnected)) {
            console.log(`Card can be placed at ${gameData.stage} ${ix}`)
            return false;
        }
    }

    console.log("Card can't be placed")
    return true;
}