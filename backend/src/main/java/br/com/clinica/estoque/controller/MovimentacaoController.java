package br.com.clinica.estoque.controller;

import br.com.clinica.estoque.dto.MovimentacaoRequest;
import br.com.clinica.estoque.model.Movimentacao;
import br.com.clinica.estoque.service.MovimentacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movimentacoes")
public class MovimentacaoController {

    private final MovimentacaoService service;

    public MovimentacaoController(MovimentacaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Movimentacao> listar(@RequestParam(required = false) Long itemId) {
        return service.listar(itemId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Movimentacao registrar(@Valid @RequestBody MovimentacaoRequest req) {
        return service.registrar(req);
    }
}
