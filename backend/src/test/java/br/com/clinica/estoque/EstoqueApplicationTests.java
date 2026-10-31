package br.com.clinica.estoque;

import br.com.clinica.estoque.dto.ItemRequest;
import br.com.clinica.estoque.dto.MovimentacaoRequest;
import br.com.clinica.estoque.model.Item;
import br.com.clinica.estoque.model.TipoMovimentacao;
import br.com.clinica.estoque.service.ItemService;
import br.com.clinica.estoque.service.MovimentacaoService;
import br.com.clinica.estoque.service.RegraNegocioException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.datasource.url=jdbc:sqlite:file:testdb?mode=memory&cache=shared")
class EstoqueApplicationTests {

    @Autowired ItemService itemService;
    @Autowired MovimentacaoService movimentacaoService;

    @Test
    void entradaESaidaAtualizamQuantidade() {
        Item item = itemService.criar(new ItemRequest("Capilar dialisador F8", "unidade"));
        assertEquals(0, item.getQuantidade());

        movimentacaoService.registrar(new MovimentacaoRequest(item.getId(), TipoMovimentacao.ENTRADA, 50, "NF 123"));
        movimentacaoService.registrar(new MovimentacaoRequest(item.getId(), TipoMovimentacao.SAIDA, 20, null));
        assertEquals(30, itemService.buscar(item.getId()).getQuantidade());

        assertThrows(RegraNegocioException.class, () ->
                movimentacaoService.registrar(new MovimentacaoRequest(item.getId(), TipoMovimentacao.SAIDA, 31, null)));
        assertEquals(30, itemService.buscar(item.getId()).getQuantidade());

        assertThrows(RegraNegocioException.class, () -> itemService.excluir(item.getId()));
    }
}
