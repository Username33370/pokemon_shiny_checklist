package io.username33370.pokemon.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Controller
@RequestMapping("/pokemon")
public class PokemonController {
    @GetMapping("/list")
    public String list(Model model) {
        List<Integer> numbers = IntStream.rangeClosed(1,1025).boxed().collect(Collectors.toList());
        model.addAttribute("numbers",numbers);
        return "list";
    }

    @GetMapping("/hunting")
    public String hunting() {
        return "hunting";
    }

    @GetMapping("/uncaught")
    public String uncaught(Model model) {
        List<Integer> numbers = IntStream.rangeClosed(1,1025).boxed().collect(Collectors.toList());
        model.addAttribute("numbers",numbers);
        return "uncaught";
    }
}
