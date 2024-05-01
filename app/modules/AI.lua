local ____lualib = require("lualib_bundle")
local __TS__ArrayForEach = ____lualib.__TS__ArrayForEach
local ____exports = {}
local AIModule
function AIModule()
    local evaluate, minimax, Human_side, AI_side
    function evaluate(win_conditions, depth)
        if win_conditions.has_winner.value == true and win_conditions.has_winner.cells_to_highlight[1].cell == AI_side then
            return 10 - depth
        elseif win_conditions.has_winner.value == true and win_conditions.has_winner.cells_to_highlight[1].cell == Human_side then
            return -10 + depth
        else
            return 0
        end
    end
    function minimax(board, isMaximazing, turn, depth, alpha, beta)
        local result = GameBoard.check_win_conditions(board)
        local score = evaluate(result, depth)
        if score ~= 0 then
            return score
        end
        if result.is_draw then
            return 0
        end
        local free_cells = GameBoard.find_free_cells(board)
        if isMaximazing then
            local best_score = -1000
            for ____, ____value in ipairs(free_cells) do
                local x = ____value.x
                local y = ____value.y
                local new_board = GameBoard.create_move(y, x, AI_side, board)
                best_score = math.max(
                    best_score,
                    minimax(
                        new_board,
                        not isMaximazing,
                        turn + 1,
                        depth + 1,
                        alpha,
                        beta
                    )
                )
                alpha = math.max(alpha, best_score)
                if best_score >= beta then
                    break
                end
            end
            return best_score
        else
            local best_score = 1000
            for ____, ____value in ipairs(free_cells) do
                local x = ____value.x
                local y = ____value.y
                local new_board = GameBoard.create_move(y, x, Human_side, board)
                best_score = math.min(
                    best_score,
                    minimax(
                        new_board,
                        not isMaximazing,
                        turn + 1,
                        depth + 1,
                        alpha,
                        beta
                    )
                )
                beta = math.min(beta, best_score)
                if best_score <= alpha then
                    break
                end
            end
            return best_score
        end
    end
    Human_side = 1
    AI_side = 2
    local is_enabled = false
    local function init()
        is_enabled = false
    end
    local function find_best_move()
        local turn = GameBoard.get_turn()
        local best_score = -1000
        local best_move = {y = -1, x = -1}
        local board = GameBoard.get_game_board()
        local free_cells = GameBoard.find_free_cells(board)
        __TS__ArrayForEach(
            free_cells,
            function(____, ____bindingPattern0)
                local x
                local y
                y = ____bindingPattern0.y
                x = ____bindingPattern0.x
                local move = GameBoard.create_move(y, x, AI_side, board)
                local score = minimax(
                    move,
                    false,
                    turn,
                    0,
                    -1000,
                    1000
                )
                if score > best_score then
                    best_score = score
                    best_move = {y = y, x = x}
                end
            end
        )
        GameBoard.update_game_board(best_move.x, best_move.y, AI_side)
    end
    local function enable()
        is_enabled = true
    end
    local function disable()
        is_enabled = false
    end
    local function get_is_enabled()
        return is_enabled
    end
    init()
    return {
        init = init,
        enable = enable,
        disable = disable,
        get_is_enabled = get_is_enabled,
        find_best_move = find_best_move
    }
end
function ____exports.register_AI()
    _G.AI = AIModule()
end
return ____exports
