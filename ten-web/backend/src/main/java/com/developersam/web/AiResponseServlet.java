package com.developersam.web;

import com.developersam.game.ten.Board;
import com.developersam.game.ten.BoardData;
import com.developersam.game.ten.ServerResponse;
import com.google.gson.Gson;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStreamReader;

public final class AiResponseServlet extends HttpServlet {

    private static final Gson GSON = new Gson();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        InputStreamReader reader = new InputStreamReader(req.getInputStream());
        BoardData boardData = GSON.fromJson(reader, BoardData.class);
        ServerResponse response = Board.respondToClient(boardData);
        GSON.toJson(response, resp.getWriter());
    }

}
