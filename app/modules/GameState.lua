local ____lualib = require("lualib_bundle")
local __TS__ArrayEvery = ____lualib.__TS__ArrayEvery
local __TS__ArrayFindIndex = ____lualib.__TS__ArrayFindIndex
local __TS__ArrayMap = ____lualib.__TS__ArrayMap
local __TS__ArraySplice = ____lualib.__TS__ArraySplice
local ____exports = {}
local GameBoardModule
function GameBoardModule()
    local create_empty_board, bind_messsages, board_size, game_state, free_cells
    function create_empty_board()
        do
            local y = 0
            while y < board_size do
                game_state[y + 1] = {}
                do
                    local x = 0
                    while x < board_size do
                        game_state[y + 1][x + 1] = 0
                        free_cells[#free_cells + 1] = {x = x, y = y, cell = 0}
                        x = x + 1
                    end
                end
                y = y + 1
            end
        end
    end
    function bind_messsages()
        return
    end
    game_state = {}
    free_cells = {}
    local current_player = 1
    local turn
    local function init()
        board_size = 3
        turn = 0
        create_empty_board()
        bind_messsages()
    end
    local function get_game_board()
        return game_state
    end
    local function get_free_cells()
        return free_cells
    end
    local function get_current_player()
        return current_player
    end
    local function get_current_player_string()
        local dict = {[1] = "x", [2] = "o"}
        return dict[current_player]
    end
    local function check_win_conditions()
        local winningRowIndex = __TS__ArrayFindIndex(
            game_state,
            function(____, row)
                local is_x_win = __TS__ArrayEvery(
                    row,
                    function(____, cell) return cell == 1 end
                )
                local is_o_win = __TS__ArrayEvery(
                    row,
                    function(____, cell) return cell == 2 end
                )
                return is_x_win or is_o_win
            end
        )
        if winningRowIndex ~= -1 then
            local winner_cells = __TS__ArrayMap(
                game_state[winningRowIndex + 1],
                function(____, _, x) return {x = x, y = winningRowIndex} end
            )
            EventBus.send("HIGHLIGHT_CELLS", {cells = winner_cells})
            local winner = game_state[winningRowIndex + 1][1]
            EventBus.send("GAME_OVER", {winner = winner})
            return
        end
        local function check_diagonals()
            local diagonal_values = {}
            local diagonal_indexes = {}
            local counter_diagonal_values = {}
            local counter_diagonal_indexes = {}
            do
                local i = 0
                while i < #game_state do
                    diagonal_values[#diagonal_values + 1] = game_state[i + 1][i + 1]
                    diagonal_indexes[#diagonal_indexes + 1] = {y = i, x = i}
                    counter_diagonal_values[#counter_diagonal_values + 1] = game_state[i + 1][#game_state - i]
                    counter_diagonal_indexes[#counter_diagonal_indexes + 1] = {y = i, x = #game_state - i - 1}
                    i = i + 1
                end
            end
            local is_diagonal_win_x = __TS__ArrayEvery(
                diagonal_values,
                function(____, cell) return cell == 1 end
            )
            local is_diagonal_win_o = __TS__ArrayEvery(
                diagonal_values,
                function(____, cell) return cell == 2 end
            )
            local is_counter_diagonal_win_x = __TS__ArrayEvery(
                counter_diagonal_values,
                function(____, cell) return cell == 1 end
            )
            local is_counter_diagonal_win_o = __TS__ArrayEvery(
                counter_diagonal_values,
                function(____, cell) return cell == 2 end
            )
            if is_diagonal_win_x or is_diagonal_win_o then
                EventBus.send("HIGHLIGHT_CELLS", {cells = diagonal_indexes})
                local winner = is_diagonal_win_x and 1 or 2
                EventBus.send("GAME_OVER", {winner = winner})
                return
            elseif is_counter_diagonal_win_x or is_diagonal_win_o then
                EventBus.send("HIGHLIGHT_CELLS", {cells = counter_diagonal_indexes})
                local winner = is_diagonal_win_x and 1 or 2
                EventBus.send("GAME_OVER", {winner = winner})
                return
            end
        end
        check_diagonals()
        local function check_columns()
            do
                local x = 0
                while x < board_size do
                    local column = __TS__ArrayMap(
                        game_state,
                        function(____, row, y) return {value = row[x + 1], x = x, y = y} end
                    )
                    local winner_x = __TS__ArrayEvery(
                        column,
                        function(____, cell) return cell.value == 1 end
                    )
                    local winner_o = __TS__ArrayEvery(
                        column,
                        function(____, cell) return cell.value == 2 end
                    )
                    local winner = winner_x and 1 or 2
                    if winner_x or winner_o then
                        EventBus.send("HIGHLIGHT_CELLS", {cells = column})
                        EventBus.send("GAME_OVER", {winner = winner})
                    end
                    x = x + 1
                end
            end
        end
        check_columns()
        if #free_cells == 0 and turn ~= 0 then
            EventBus.send("GAME_OVER", {tie = true})
        end
    end
    local function update_game_board(x, y, value)
        game_state[y + 1][x + 1] = value
        local index = __TS__ArrayFindIndex(
            free_cells,
            function(____, cell) return cell.x == x and cell.y == y end
        )
        __TS__ArraySplice(free_cells, index, 1)
        check_win_conditions()
        EventBus.send("DRAW_TURN", {x = x, y = y, value = value})
        turn = turn + 1
        current_player = current_player == 1 and 2 or 1
        if current_player == 2 then
            AI.make_move()
        end
    end
    init()
    return {
        init = init,
        get_game_board = get_game_board,
        get_free_cells = get_free_cells,
        update_game_board = update_game_board,
        get_current_player = get_current_player,
        get_current_player_string = get_current_player_string
    }
end
function ____exports.register_game_board()
    _G.AI = GameBoardModule()
end
return ____exports
