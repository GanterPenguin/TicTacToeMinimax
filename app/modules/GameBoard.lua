local ____lualib = require("lualib_bundle")
local __TS__ArrayMap = ____lualib.__TS__ArrayMap
local __TS__ArrayConcat = ____lualib.__TS__ArrayConcat
local __TS__ArrayEvery = ____lualib.__TS__ArrayEvery
local __TS__ArrayFilter = ____lualib.__TS__ArrayFilter
local ____exports = {}
local GameBoardModule
function GameBoardModule()
    local create_empty_board, bind_messsages, board_size, game_state
    function create_empty_board()
        do
            local y = 0
            while y < board_size do
                game_state[y + 1] = {}
                do
                    local x = 0
                    while x < board_size do
                        game_state[y + 1][x + 1] = 0
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
    local current_player = 1
    local _turn
    local function init()
        current_player = 1
        board_size = 3
        _turn = 0
        game_state = {}
        create_empty_board()
        bind_messsages()
    end
    local function get_turn()
        return _turn
    end
    local function get_game_board()
        return game_state
    end
    local function create_move(y, x, value, board)
        local new_board = {}
        do
            local y = 0
            while y < board_size do
                new_board[y + 1] = {}
                do
                    local x = 0
                    while x < board_size do
                        new_board[y + 1][x + 1] = board[y + 1][x + 1]
                        x = x + 1
                    end
                end
                y = y + 1
            end
        end
        new_board[y + 1][x + 1] = value
        return new_board
    end
    local function find_free_cells(game_board)
        local result = {}
        do
            local y = 0
            while y < #game_board do
                do
                    local x = 0
                    while x < #game_board do
                        if game_board[y + 1][x + 1] == 0 then
                            result[#result + 1] = {y = y, x = x, cell = 0}
                        end
                        x = x + 1
                    end
                end
                y = y + 1
            end
        end
        return result
    end
    local function get_current_player()
        return current_player
    end
    local function get_player_string(value)
        local dict = {[0] = "", [1] = "x", [2] = "o"}
        return dict[value]
    end
    local function get_rows(board)
        return __TS__ArrayMap(
            board,
            function(____, row, y) return __TS__ArrayMap(
                row,
                function(____, cell, x) return {x = x, y = y, cell = cell} end
            ) end
        )
    end
    local function get_columns(board)
        local columns = {}
        do
            local x = 0
            while x < board_size do
                columns[#columns + 1] = __TS__ArrayMap(
                    board,
                    function(____, row, y) return {cell = row[x + 1], x = x, y = y} end
                )
                x = x + 1
            end
        end
        return columns
    end
    local function get_diagonals(board)
        local diagonal = {}
        local counter_diagonal = {}
        do
            local i = 0
            while i < #board do
                diagonal[#diagonal + 1] = {x = i, y = i, cell = board[i + 1][i + 1]}
                counter_diagonal[#counter_diagonal + 1] = {x = #board - i - 1, y = i, cell = board[i + 1][#board - i]}
                i = i + 1
            end
        end
        return {diagonal, counter_diagonal}
    end
    local function check_win_conditions(board)
        local rows = get_rows(board)
        local columns = get_columns(board)
        local diagonals = get_diagonals(board)
        local lines = __TS__ArrayConcat(rows, columns, diagonals)
        local result = __TS__ArrayFilter(
            lines,
            function(____, line)
                return __TS__ArrayEvery(
                    line,
                    function(____, cell) return cell.cell ~= 0 and cell.cell == line[1].cell end
                )
            end
        )
        local has_winner = {value = #result ~= 0, cells_to_highlight = result[1]}
        local is_draw = #result == 0 and #find_free_cells(board) == 0
        return {has_winner = has_winner, is_draw = is_draw, is_game_over = has_winner.value or is_draw}
    end
    local function update_game_board(x, y, value)
        game_state[y + 1][x + 1] = value
        local win = check_win_conditions(game_state)
        EventBus.send("DRAW_TURN", {x = x, y = y, value = value})
        if win.is_draw then
            EventBus.send("GAME_OVER", {tie = true})
            return
        elseif win.has_winner.value then
            EventBus.send("HIGHLIGHT_CELLS", {cells = win.has_winner.cells_to_highlight})
            EventBus.send("GAME_OVER", {winner = win.has_winner.cells_to_highlight[1].cell})
            return
        end
        _turn = _turn + 1
        current_player = current_player == 1 and 2 or 1
        if AI.get_is_enabled() and current_player == 2 then
            AI.find_best_move()
        end
    end
    init()
    return {
        init = init,
        get_game_board = get_game_board,
        update_game_board = update_game_board,
        get_current_player = get_current_player,
        get_player_string = get_player_string,
        check_win_conditions = check_win_conditions,
        get_turn = get_turn,
        find_free_cells = find_free_cells,
        create_move = create_move
    }
end
function ____exports.register_game_board()
    _G.GameBoard = GameBoardModule()
end
return ____exports
